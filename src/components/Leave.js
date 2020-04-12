import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import styles from '../assets/popupStyles';
import { translate } from '../services/translationService';

export default class LeaveComponent extends Component {
    render() {
        return (
            <View style={styles.clearScreen}>


                <View style={styles.panel}>
                    <Text style={styles.panelTitle}>{translate("leave")}</Text>

                    <View style={styles.panelButtonsContainer}>
                        <TouchableOpacity onPress={this.props.onResume}>
                            <View style={styles.panelButton}>
                                <Image style={styles.panelButtonIcon} resizeMode="contain" source={IMAGES.noIcon} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.props.onLeave}>
                            <View style={styles.panelButton}>
                                <Image style={styles.panelButtonIcon} resizeMode="contain" source={IMAGES.yesIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}