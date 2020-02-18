import { StyleSheet } from 'react-native';
import Constants from './appConstants';

export default styles = StyleSheet.create({
    clearScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_HEIGHT,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    clearedLevelContainer: {
        width: Constants.YR * 250,
        height: Constants.YR * 250,
        borderRadius: Constants.YR * 125,
        backgroundColor: 'tomato',
        borderWidth: 5,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    clearedLevelText: {
        fontSize: 45,
        color: 'white',
        fontFamily: 'LilitaOne-Regular',
    },
    scoreIcon: {
        width: Constants.YR * 64,
        height: Constants.YR * 64,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems:'center',
        minWidth: 180,
        justifyContent: 'space-evenly'

    },
    regularText: {
        textAlign: 'center',
        fontSize: 17,
        minWidth:Constants.YR * 68,
        color: 'white',
        fontFamily: 'LilitaOne-Regular'
    },
    panel: {
        backgroundColor: '#29aecc',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: Constants.YR * 400,
        height: Constants.YR * 400,
        marginTop: Constants.YR * -40,
        padding: 4
    },
    panelTitle: {
        fontSize: 30,
        textAlign: 'center',
        color: 'black',
        fontFamily: 'LilitaOne-Regular',
        textShadowColor: 'white',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: 8
    },
    panelText: {
        fontSize: 31,
        color: 'white',
        fontFamily: 'LilitaOne-Regular',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginBottom: Constants.YR * 50
    },
    panelButtonsContainer: {
        position: 'absolute',
        height: Constants.YR * 80,
        bottom: Constants.YR * -40,
        alignItems: 'center',
        justifyContent: 'center',
        width: Constants.YR * 350,
        flexDirection: 'row'
    },
    panelButton: {
        width: Constants.YR * 80,
        height: Constants.YR * 80,
        borderRadius: Constants.YR * 40,
        backgroundColor: 'tomato',
        borderWidth: 5,
        borderColor: 'white',
        marginLeft: Constants.XR * 15,
        marginRight: Constants.XR * 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    panelButtonIcon: {
        width: Constants.YR * 35,
        height: Constants.YR * 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startPanel: {
        backgroundColor: '#29aecc',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: Constants.MAX_WIDTH*0.8,
        height: Constants.MAX_HEIGHT*0.6,
        marginTop: Constants.YR * -40
    },
    startPanelTitle:{
        position: 'absolute',
        top: -70,
        fontSize: 50,
        width: Constants.MAX_WIDTH,
        color: 'black',
        fontFamily: 'LilitaOne-Regular',
        textShadowColor: 'white',
        textAlign: 'center',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 20
    },
    startButton : {
        width: '90%',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 10,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 4
    },
    startText: {
        fontFamily: 'LilitaOne-Regular',
        fontSize: 18,
        color: 'black',
        marginLeft: 'auto',
        marginRight: 'auto'

    },

    startPlayButton :{
        width: Constants.YR * 150,
        height: Constants.YR * 150,
        borderRadius: Constants.YR * 75,
        backgroundColor: 'tomato',
        borderWidth: 5,
        borderColor: 'white',
        margin: Constants.XR * 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startIcon: {
        width: Constants.YR * 48,
        height: Constants.YR * 48,
    },
    rulesPanel: {
        backgroundColor: '#29aecc',
        borderColor: 'white',
        borderWidth: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Constants.MAX_WIDTH*0.9,
        height: Constants.MAX_HEIGHT*0.8,
        marginTop: Constants.YR * -40
    },
    rulesText: {
        textAlign: 'center',
        fontSize: 14,
        color: 'white',
        fontFamily: 'LilitaOne-Regular',
        width: '80%'
    },
    rulesActorContainer: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-evenly',
        marginBottom: 8

    },
    rulesIcon: {
        width: Constants.YR * 100,
        height: Constants.YR * 100,
    },
    gameOverIcon: {
        width: Constants.YR * 160,
        height: Constants.YR * 160,
    },
})