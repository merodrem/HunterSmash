import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import styles from '../assets/popupStyles';
import { translate } from '../services/translationService';

export default class PauseComponent extends Component {
    render() {
        return (
            <View style={styles.clearScreen}>


                <View style={styles.panel}>
                    <Text style={styles.panelTitle}>{translate("ready")}</Text>

                    <View style={styles.panelButtonsContainer}>
                        <TouchableOpacity onPress={this.props.onReset}>
                            <View style={styles.panelButton}>
                                <Image style={styles.panelButtonIcon} resizeMode="contain" source={IMAGES.restartIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.onResume}>
                            <View style={styles.panelButton}>
                                <Image style={styles.panelButtonIcon} resizeMode="contain" source={IMAGES.playIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}