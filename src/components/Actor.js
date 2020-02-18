import React, { Component } from 'react';
import { View, StyleSheet, Button, Image, TouchableWithoutFeedback, Text, Animated } from 'react-native';
import IMAGES from '../assets/images';
import SpriteSheet from 'rn-sprite-sheet';
import CONSTANTS from '../assets/appConstants';

export const ActorType = Object.freeze({
    HUNTER: Symbol("hunter"),
    BOSS: Symbol("boss"),
    BOAR: Symbol("boar"),
    BIKE: Symbol("bike")
});

export const ActorPoints = Object.freeze({
    HUNTER: 1,
    BOSS: 10,
    BOAR: -10,
});

export default class ActorComponent extends Component {
    constructor(props) {
        super(props);
        this.isWhacked = false;
        this.actor = null;
        this.poppingActorType = undefined;
        this.state = {
            animation: new Animated.Value(0),
            pointsText: '+1',
            pointsTextColor: 'green'
        }
    }


    _startAnimation = () => {

        Animated.timing(this.state.animation, {
            toValue: 1,
            timing: 500
        }).start(() => {
            Animated.timing(this.state.animation, {
                toValue: 0,
                duration: 500
            }).start();
        })
    }

    huntersmash(isBoss) {
        this.setState({ pointsText: isBoss ? '+10' : '+1', pointsTextColor: 'green' }, this._startAnimation())
        this.props.onHunterHit(isBoss);
        this.actor.play({
            type: isBoss ? "boss_dizzy" : "dizzy",
            fps: 24,
            onFinish: () => {
                this.actor.play({
                    type: isBoss ? "boss_faint" : "faint",
                    fps: 24,
                    onFinish: () => {
                        this.isPopping = false;
                        this.props.onFinishPopping(this.props.index);
                    }
                })
            }
        })
    }

    whackABike() {
        this.props.onBikeHit()
        this.actor.play({
            type: "bike_hide",
            fps: 24,
            onFinish: () => {
                this.isPopping = false;
                this.props.onFinishPopping(this.props.index);
            }
        })

    }

    whackABoar() {
        this.setState({ pointsText: '-10', pointsTextColor: 'red' }, this._startAnimation())
        this.props.onBoarHit()
        this.actor.play({
            type: "boar_faint",
            fps: 24,
            onFinish: () => {
                this.isPopping = false;
                this.props.onFinishPopping(this.props.index);
            }
        })

    }

    whack = () => {
        if (!this.isPopping || this.isWhacked) {
            return;
        }
        if (this.actionTimeout) {
            clearTimeout(this.actionTimeout);
        }
        this.isWhacked = true;
        switch (this.poppingActorType) {
            case ActorType.HUNTER:
                this.huntersmash(false)
                break;
            case ActorType.BOSS:
                this.huntersmash(true)
                break;
            case ActorType.BOAR:
                this.whackABoar()
                break;
            case ActorType.BIKE:
                this.whackABike()
            default:
                break;
        }
    }

    pop = (actorType) => {
        this.isWhacked = false;
        this.isPopping = true;
        this.poppingActorType = actorType;
        // hunter: 60%
        // boss: 10%
        // boar: 20%
        // bike: 10%
        let appearAnimation = "appear";
        let hideAnimation = "hide";
        switch (actorType) {
            case ActorType.BOSS:
                appearAnimation = "boss_appear"
                hideAnimation = "boss_hide"
                break;
            case ActorType.BOAR:
                appearAnimation = "boar_appear"
                hideAnimation = "boar_hide"
                break;
            case ActorType.BIKE:
                appearAnimation = "bike_appear"
                hideAnimation = "bike_hide"
            default:
                break;
        }
        this.actor.play({
            type: appearAnimation,
            fps: 24,
            onFinish: () => {
                this.actionTimeout = setTimeout(() => {
                    this.actor.play({
                        type: hideAnimation,
                        fps: 24,
                        onFinish: () => {
                            this.isPopping = false;
                            this.props.onFinishPopping(this.props.index);
                        }
                    })
                }, this._getApparitionTime())
            }
        });
    }

    _getApparitionTime() {
        return this.poppingActorType === ActorType.BOSS ? 0 : 1000 - Math.min(Math.floor((this.props.level - 1) / 2), 10);
    }

    render() {
        const animatedStyle = {
            opacity: this.state.animation,
            color: this.state.pointsTextColor
        }
        return (
            <View style={{ flex: 1 }}>
                <SpriteSheet
                    ref={ref => (this.actor = ref)}
                    source={IMAGES.sprites}
                    columns={6}
                    rows={8}
                    width={100}
                    animations={{
                        idle: [0],
                        appear: [5, 6, 7, 8],
                        bike_appear: [21, 22, 23],
                        boar_appear: [15, 16, 17],
                        boss_appear: [1, 2, 3, 4],
                        hide: [8, 7, 6, 5, 0],
                        bike_hide: [23, 22, 21, 0],
                        boar_hide: [17, 16, 15, 0],
                        boss_hide: [4, 3, 2, 1, 0],
                        dizzy: [9, 10, 11, 9, 10, 11],
                        boss_dizzy: [24, 25, 26, 24, 25, 26],
                        faint: [12, 12, 13, 14, 0],
                        boar_faint: [18, 18, 18, 19, 20, 0],
                        boss_faint: [27, 27, 28, 29, 0],
                        attack: [11, 12, 13, 14, 15, 16],
                        heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33]
                    }}
                >
                </SpriteSheet>
                <Animated.Text onPress={() => this.whack()} style={[styles.absoluteContainer, styles.scoreText, animatedStyle]}>
                    {this.state.pointsText}
                </Animated.Text>
                <TouchableWithoutFeedback onPress={() => this.whack()} style={styles.absoluteContainer}>
                    <View style={styles.absoluteContainer} />
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    absoluteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    scoreText: {
        fontFamily: 'LilitaOne-Regular',
        textAlign: 'center',
        fontSize: 15,
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    }
})