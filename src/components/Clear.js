import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from '../assets/popupStyles';
import { ActorPoints } from './Actor';
import { translate } from '../services/translationService';

export default class ClearComponent extends Component {
    render() {
        const { hunterHit, hunterPopped, bossHit, bossPopped, boarHit, boarPopped } = this.props;
        return (
            <View style={styles.clearScreen}>
                <View style={styles.clearedLevelContainer}>
                    <Text style={styles.clearedLevelText}>{translate("level")}</Text>
                    <Text style={styles.clearedLevelText}>{this.props.level}</Text>
                </View>

                <View style={styles.startPanel}>
                    <Text style={styles.panelTitle}>{translate("cleared")}</Text>
                    <View style={styles.scoreContainer}>
                        <Image style={styles.scoreIcon} resizeMode="contain" source={IMAGES.hunterIcon} />
                        <Text style={styles.regularText}>{hunterHit}/{hunterPopped}</Text>
                    </View>
                    <View style={styles.scoreContainer}>
                        <Image style={styles.scoreIcon} resizeMode="contain" source={IMAGES.bossIcon} />

                        <Text style={styles.regularText}>{bossHit}/{bossPopped}</Text>
                    </View>
                    <View style={styles.scoreContainer}>
                        <Image style={styles.scoreIcon} resizeMode="contain" source={IMAGES.boarIcon} />
                        <Text style={[styles.regularText, (boarHit == 0) ? { color: 'green' } : { color: 'red' }]}>{boarHit}/{boarPopped}</Text>

                    </View>
                    <Text style={styles.panelText}>{translate('levelScore')}: {hunterHit * ActorPoints.HUNTER + bossHit * ActorPoints.BOSS + boarHit * ActorPoints.BOAR}</Text>
                    <TouchableOpacity onPress={this.props.onReset}>
                        <View style={[styles.startButton, { backgroundColor: 'tomato', borderColor: 'white' }]}>
                            <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.restartIcon} />
                            <Text style={[styles.startText, { color: 'white' }]}>{translate('restart')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.onNextLevel}>
                        <View style={[styles.startButton, { backgroundColor: 'tomato', borderColor: 'white' }]}>
                            <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.playIcon} />
                            <Text style={[styles.startText, { color: 'white' }]}>{translate('next')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}