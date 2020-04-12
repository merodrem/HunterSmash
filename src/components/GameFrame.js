import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text,
  BackHandler
} from 'react-native';
import * as RNLocalize from "react-native-localize";
import AsyncStorage from '@react-native-community/async-storage';
import IMAGES from '../assets/images';
import CONSTANTS from '../assets/appConstants';
import GameOverComponent from './GameOver';
import ClearComponent from './Clear';
import PauseComponent from './Pause';
import ActorComponent, { ActorType, ActorPoints } from './Actor';
import StartComponent from './Start';
import { setI18nConfig, translate } from '../services/translationService';
import CreditsComponent from './Credits';
import RulesComponent from './Rules';
import LeaveComponent from './Leave';

const DEFAULT_TIME = 20;
const DEFAULT_STATE = {
  level: 1,
  score: 0,
  time: DEFAULT_TIME,
  cleared: false,
  leave: false,
  paused: false,
  gameover: false,
  start: true,
  credits: false,
  instructions: false,
  health: 100,
  hunterHit: 0,
  hunterPopped: 0,
  bossHit: 0,
  bossPopped: 0,
  boarHit: 0,
  boarPopped: 0,
}

export default class GameFrameComponent extends Component {
  constructor(props) {
    super(props);
    setI18nConfig()
    this.state = {
      ...DEFAULT_STATE,
      maxScore: 0
    };
    this.actors = [];
    this.actorsPopping = 0;
    this.interval = null;
    this.timeInterval = null;
    this.lastCellPopped = null;
  }

  backAction = () => {
    if(this.state.start){
      BackHandler.exitApp()
    }
    else{
      if (this.interval) clearInterval(this.interval);
      if (this.timeInterval) clearInterval(this.timeInterval);
      this.setState({leave:true})
      return true;
    }
  };

  componentDidMount = () => {
    AsyncStorage.getItem('@maxScore')
      .then(maxScore => this.setState({ ...DEFAULT_STATE, maxScore: JSON.parse(maxScore) }))
      .catch(error => {
        console.log(error)
        this.setState(DEFAULT_STATE);
      })
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();//oh! the ugly forceUpdate!
  };

  _setupTicks = () => {
    let speed = 750 - (Math.floor(this.state.level / 2) * 50);
    if (speed < 350) {
      speed = 350;
    }
    this.interval = setInterval(this._popRandomActor, speed);
    this.timeInterval = setInterval(this._timerTick, 1000);
  }

  _randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  _onFinishPopping = (index) => {
    this.actorsPopping -= 1;
  }


  _popRandomActor = () => {
    const { hunterPopped, bossPopped, boarPopped } = this.state;
    if (this.actors.length != 12 || this.actorsPopping > 3) {
      return;
    }


    let randomIndex = this._randomBetween(0, 11);
    while (randomIndex == this.lastCellPopped) {
      randomIndex = this._randomBetween(0, 11);
    }
    if (!this.actors[randomIndex].isPopping) {
      // hunter: 60%
      // boss: 10%
      // boar: 20%
      // bike: 10%
      this.actorsPopping += 1;
      this.lastCellPopped = randomIndex
      const actorType = (Math.random() < 0.1) ? (this.setState({ bossPopped: bossPopped + 1 }), ActorType.BOSS)
        : (Math.random() < 0.2) ? (this.setState({ boarPopped: boarPopped + 1 }), ActorType.BOAR)
          : (Math.random() < 0.1) ? ActorType.BIKE : (this.setState({ hunterPopped: hunterPopped + 1 }), ActorType.HUNTER);
      this.actors[randomIndex].pop(actorType);

    }
  }

  _timerTick = () => {
    if (this.state.time === 0) {
      clearInterval(this.interval);
      clearInterval(this.timeInterval);
      if (this.state.score > this.state.maxScore) {
        AsyncStorage.setItem('@maxScore', JSON.stringify(this.state.score))
        this.setState({ cleared: true, maxScore: this.state.score })
      }
      else {
        this.setState({ cleared: true })
      }

    } else {
      this.setState({
        time: this.state.time - 1
      })
    }
  }



  _onHunterHit = (isBoss) => {
    if (this.state.time > 0) {
      if (isBoss) {
        this.setState({
          score: this.state.score + ActorPoints.BOSS,
          bossHit: this.state.bossHit + 1
        })
      }
      else {
        this.setState({
          score: this.state.score + ActorPoints.HUNTER,
          hunterHit: this.state.hunterHit + 1
        })
      }
    }

  }

  _onBoarHit = () => {
    if (this.state.time > 0) {
      this.setState({
        score: this.state.score + ActorPoints.BOAR,
        boarHit: this.state.boarHit + 1

      })
    }
  }

  _onBikeHit = () => {
    if (this.state.time > 0) {
      this._gameOver()
    }
  }

  _reset = () => {
    this.actorsPopping = 0;
    this.setState(DEFAULT_STATE);
  }

  _pause = () => {
    if (this.interval) clearInterval(this.interval);
    if (this.timeInterval) clearInterval(this.timeInterval);
    this.setState({
      paused: true
    });
  }

  _resume = () => {
    this.actorsPopping = 0;
    this.setState({
      paused: false,
      start: false,
      leave: false
    }, this._setupTicks);
  }

  _nextLevel = () => {
    this.actorsPopping = 0;

    this.setState({
      level: this.state.level + 1,
      cleared: false,
      gameover: false,
      time: DEFAULT_TIME,
      hunterHit: 0,
      hunterPopped: 0,
      bossHit: 0,
      bossPopped: 0,
      boarHit: 0,
      boarPopped: 0,
    }, this._setupTicks)
  }

  _gameOver = () => {
    clearInterval(this.interval);
    clearInterval(this.timeInterval);

    this.setState({
      gameover: true
    });
  }

  render() {
    let healthBarWidth = (CONSTANTS.MAX_WIDTH - CONSTANTS.XR * 100 - CONSTANTS.XR * 60 - CONSTANTS.XR * 6) * this.state.health / 100;
    return (
      <View style={styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={IMAGES.background} />
        {!this.state.start && <View style={styles.topPanel}>
          <SafeAreaView>
            <View style={styles.statsContainer}>
              <View style={styles.stats}>
                <View style={styles.levelContainer}>
                  <Text style={styles.levelTitle}>{translate("level")}</Text>
                  <Text style={styles.levelNumber}>{this.state.level}</Text>
                </View>
              </View>
              <View style={styles.stats}>
                <View style={styles.timeBar}>
                  <Text style={styles.timeNumber}>{this.state.time}</Text>
                </View>
                <Image style={styles.timeIcon} resizeMode="stretch" source={IMAGES.timeIcon} />
              </View>
              <View style={styles.stats}>
                <View style={styles.scoreBar}>
                  <Text style={styles.scoreNumber}>{this.state.score}</Text>
                </View>
                <Image style={styles.scoreIcon} resizeMode="stretch" source={IMAGES.scoreIcon} />
              </View>
              <View style={styles.stats}>
                <View style={styles.scoreBar}>
                  <Text style={styles.scoreNumber}>{this.state.maxScore}</Text>
                </View>
                <Image style={styles.scoreIcon} resizeMode="stretch" source={IMAGES.recordIcon} />
              </View>
              <View style={styles.stats}>
                <TouchableOpacity onPress={this._pause}>
                  <View style={styles.pauseButton}>
                    <Image style={styles.pauseButtonIcon} resizeMode="stretch" source={IMAGES.pauseIcon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
        }
        <View style={styles.playArea}>
          {Array.apply(null, Array(4)).map((el, rowIdx) => {
            return (
              <View style={styles.playRow} key={rowIdx}>
                {Array.apply(null, Array(3)).map((el, colIdx) => {
                  let hunterIdx = (rowIdx * 3) + colIdx;

                  return (
                    <View style={styles.playCell} key={colIdx}>
                      <ActorComponent
                        index={hunterIdx}
                        level={this.state.level}
                        ref={(ref) => { this.actors[hunterIdx] = ref }}
                        onFinishPopping={this._onFinishPopping}
                        onHunterHit={this._onHunterHit}
                        onBoarHit={this._onBoarHit}
                        onBikeHit={this._onBikeHit}
                      />
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
        {this.state.cleared && <ClearComponent
          onReset={this._reset}
          onNextLevel={this._nextLevel}
          level={this.state.level} score={this.state.score}
          hunterHit={this.state.hunterHit}
          hunterPopped={this.state.hunterPopped}
          bossHit={this.state.bossHit}
          bossPopped={this.state.bossPopped}
          boarHit={this.state.boarHit}
          boarPopped={this.state.boarPopped}
        />}
        {this.state.start && <StartComponent onStart={this._resume} onRules={() => this.setState({ rules: true })} onCredits={() => this.setState({ credits: true })} />}
        {this.state.rules && <RulesComponent onBack={() => this.setState({ rules: false })} />}
        {this.state.credits && <CreditsComponent onBack={() => this.setState({ credits: false })} />}
        {this.state.gameover && <GameOverComponent onReset={this._reset} level={this.state.level} score={this.state.score} />}
        {this.state.paused && <PauseComponent onReset={this._reset} onResume={this._resume} />}
        {this.state.leave && <LeaveComponent onResume={this._resume} onLeave={this._reset} />}
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },

  backgroundImage: {
    width: CONSTANTS.MAX_WIDTH,
    height: CONSTANTS.MAX_HEIGHT,
    position: 'absolute'
  },
  topPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CONSTANTS.YR * 250,
    flexDirection: 'column'
  },
  statsContainer: {
    width: CONSTANTS.MAX_WIDTH,
    height: CONSTANTS.YR * 120,
    flexDirection: 'row'
  },
  stats: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    width: CONSTANTS.YR * 80,
    height: CONSTANTS.YR * 80,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pauseButtonIcon: {
    width: CONSTANTS.YR * 35,
    height: CONSTANTS.YR * 35,
  },
  levelContainer: {
    width: CONSTANTS.YR * 80,
    height: CONSTANTS.YR * 80,
    backgroundColor: 'tomato',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  levelTitle: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'LilitaOne-Regular'
  },
  levelNumber: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'LilitaOne-Regular'
  },
  scoreIcon: {
    position: 'absolute',
    left: 0,
    width: CONSTANTS.YR * 40,
    height: CONSTANTS.YR * 40,
  },
  scoreBar: {
    height: CONSTANTS.YR * 25,
    position: 'absolute',
    left: 20,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scoreNumber: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'LilitaOne-Regular',
  },
  timeIcon: {
    position: 'absolute',
    left: 0,
    width: CONSTANTS.YR * 40,
    height: CONSTANTS.YR * 40,
  },
  timeBar: {
    height: CONSTANTS.YR * 25,
    position: 'absolute',
    left: 20,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  timeNumber: {
    fontSize: 17,
    color: 'black',
    fontFamily: 'LilitaOne-Regular',
  },
  healthBarContainer: {
    height: CONSTANTS.YR * 40,
    width: CONSTANTS.MAX_WIDTH - CONSTANTS.XR * 120,
    marginLeft: CONSTANTS.XR * 60
  },
  healthIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CONSTANTS.YR * 46,
    height: CONSTANTS.YR * 40,
  },
  healthBar: {
    height: CONSTANTS.YR * 20,
    width: CONSTANTS.MAX_WIDTH - CONSTANTS.XR * 100 - CONSTANTS.XR * 60,
    marginLeft: CONSTANTS.XR * 40,
    marginTop: CONSTANTS.YR * 10,
    backgroundColor: 'white',
    borderRadius: CONSTANTS.YR * 10
  },
  healthBarInner: {
    position: 'absolute',
    backgroundColor: 'tomato',
    left: CONSTANTS.XR * 3,

    top: CONSTANTS.YR * 3,
    bottom: CONSTANTS.YR * 3,
    borderRadius: CONSTANTS.YR * 8
  },
  playArea: {
    width: CONSTANTS.MAX_WIDTH,
    marginTop: CONSTANTS.YR * 250,
    height: CONSTANTS.MAX_HEIGHT - CONSTANTS.YR * 250 - CONSTANTS.YR * 112,
    flexDirection: 'column',
  },
  playRow: {
    height: (CONSTANTS.MAX_HEIGHT - CONSTANTS.YR * 250 - CONSTANTS.YR * 112) / 4,
    width: CONSTANTS.MAX_WIDTH,
    flexDirection: 'row',
  },
  playCell: {
    width: CONSTANTS.MAX_WIDTH / 3,
    height: (CONSTANTS.MAX_HEIGHT - CONSTANTS.YR * 250 - CONSTANTS.YR * 112) / 4,
    alignItems: 'center'
  }
});