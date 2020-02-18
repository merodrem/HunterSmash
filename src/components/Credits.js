import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Linking,
} from 'react-native';
import styles from '../assets/popupStyles';
import { translate } from '../services/translationService';
import IMAGES from '../assets/images';



export default class CreditsComponent extends Component {
    constructor(props) {
        super(props)
    }
    CREDITS = [
        {
            id: 0,
            text: translate("freepik"),
            url: "https://www.freepik.com/"
        },
        {
            id: 1,
            text: translate("fontawesome"),
            url: "https://fontawesome.com/"
        }, {
            id: 2,
            text: translate("brgfx"),
            url: "https://www.freepik.com/free-photos-vectors/background"
        }, {
            id: 3,
            text: translate("flaticon"),
            url: "https://www.flaticon.com/"
        },
    ];
    render() {
        return (
            <View style={styles.clearScreen}>
                <View style={styles.rulesPanel}>
                    <Text style={styles.panelTitle}>{translate("credits")}</Text>
                    <Text style={styles.regularText}>{translate("lepunkThanks")}</Text>
                    <TouchableOpacity style={styles.startButton}
                        onPress={() => Linking.openURL("https://github.com/lepunk/react-native-videos/tree/master/WhackAMole").catch(err => console.log('An error occurred', err))}
                    >
                        <Image style={styles.startIcon} resizeMode="contain" source={IMAGES.githubIcon} />
                        <Text style={styles.startText}>{translate('lepunkCode')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.regularText}>{translate("graphicalCredits")}</Text>
                    {
                        this.CREDITS.map(credit => {
                            return(
                                <Text
                                    key={credit.id}
                                    style={[styles.rulesText, { textDecorationLine: 'underline' }]}
                                    onPress={() => Linking.openURL(credit.url).catch(err => console.log('An error occurred', err))}
                                >
                                    {credit.text}
                                </Text>
                            )
                        })
                    }
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