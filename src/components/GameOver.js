import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from '../assets/popupStyles';
import { translate } from '../services/translationService';

export default class GameOverComponent extends Component {
    render() {
        return (
            <View style={styles.clearScreen}>
                <View style={styles.clearedLevelContainer}>
                    <Text style={styles.clearedLevelText}>{translate("level")}</Text>
                    <Text style={styles.clearedLevelText}>{this.props.level}</Text>
                </View>

                <View style={styles.panel}>
                    <Image style={styles.gameOverIcon} resizeMode="contain" source={IMAGES.hurtBike} />
                    <Text style={styles.regularText}>{translate("gameOver")}</Text>
                    <Text style={styles.panelTitle}>Game Over</Text>
                    <Text style={styles.panelText}>Score: {this.props.score}</Text>
                    <View style={styles.panelButtonsContainer}>
                        <TouchableOpacity onPress={this.props.onReset}>
                            <View style={styles.panelButton}>
                                <Image style={styles.panelButtonIcon} resizeMode="contain" source={IMAGES.restartIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}