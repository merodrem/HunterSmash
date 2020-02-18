import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import styles from '../assets/popupStyles';
import { translate } from '../services/translationService';
import IMAGES from '../assets/images';

export default class StartComponent extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={styles.clearScreen}>
                <View style={styles.startPanel}>
                    <Text style={styles.startPanelTitle}>hunterSMASH</Text>
                    <TouchableOpacity style={styles.startPlayButton}
                        onPress={this.props.onStart}>
                        <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.playIcon} />
                        <Text style={[styles.startText, { color: 'white' }]}>{translate('startGame')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.startButton}
                        onPress={this.props.onRules}>
                        <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.instructionsIcon} />
                        <Text style={styles.startText}>{translate('instructions')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Linking.openURL("https://ko-fi.com/nomadicdev").catch(err => console.log('An error occurred', err))}
                        style={[styles.startButton, { backgroundColor: 'tomato', borderColor: 'white' }]}>
                        <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.supportIcon} />
                        <Text style={[styles.startText, { color: 'white' }]}>{translate('support')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => Linking.openURL("https://github.com/merodrem/HunterSmash").catch(err => console.log('An error occurred', err))}
                    >
                        <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.githubIcon} />
                        <Text style={styles.startText}>{translate('code')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.startButton}
                        onPress={this.props.onCredits}>
                        <Text style={styles.startText}>{translate('credits')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}