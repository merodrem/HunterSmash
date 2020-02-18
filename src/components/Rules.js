import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import styles from '../assets/popupStyles';
import { translate } from '../services/translationService';
import IMAGES from '../assets/images';

export default class RulesComponent extends Component {
    constructor(props) {
        super(props)
    }
    ACTORS = [
        {
            id: 0,
            icon: IMAGES.hunterSteadyIcon,
            description: translate("hunters")
        },
        {
            id: 1,
            icon: IMAGES.bossSteadyIcon,
            description: translate('boss')
        },
        {
            id: 2,
            icon: IMAGES.boarSteadyIcon,
            description: translate("boars")
        },
        {
            id: 3,
            icon: IMAGES.bikeSteadyIcon,
            description: translate("bikes")
        },
    ];
    
    render() {
        return (
            <View style={styles.clearScreen}>
                <View style={styles.rulesPanel}>
                    <View>
                        <Text style={styles.panelTitle}>{translate("instructions")}</Text>
                        <Text style={styles.regularText}>{translate("howtoplayIntro")}</Text>
                        <Text style={styles.regularText}>{translate("howtoplayWarning")}</Text>
                    </View>
                    <View>
                    {
                        this.ACTORS.map(actor => {
                            return (
                                <View key={actor.id} style={styles.rulesActorContainer}>
                                    <Image style={styles.rulesIcon} resizeMode="contain" source={actor.icon} />

                                    <Text style={styles.rulesText}>{actor.description}</Text>
                                </View>
                            )
                        }
                        )
                    }
                    </View>
                    <TouchableOpacity
                        onPress={this.props.onBack}
                        style={[styles.startButton, { backgroundColor: 'tomato', borderColor: 'white' }]}>
                        <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.backIcon} />
                        <Text style={[styles.startText, { color: 'white' }]}>{translate('back')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}