import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Text
} from 'react-native';
import * as RNLocalize from "react-native-localize";
import AsyncStorage from '@react-native-community/async-storage';
import IMAGES from './assets/images';
import CONSTANTS from './assets/appConstants';
import GameOverComponent from './components/GameOver';
import ClearComponent from './components/Clear';
import PauseComponent from './components/Pause';
import ActorComponent, { ActorType, ActorPoints } from './components/Actor';
import StartComponent from './components/Start';
import { setI18nConfig, translate } from './services/translationService';
import CreditsComponent from './components/Credits';
import GameFrameComponent from './components/GameFrame';

const DEFAULT_TIME = 20;
const DEFAULT_STATE = {
  level: 1,
  score: 0,
  time: DEFAULT_TIME,
  cleared: false,
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

export default class App extends Component {
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

  componentDidMount = () => {
    AsyncStorage.getItem('@maxScore')
      .then(maxScore => this.setState({ ...DEFAULT_STATE, maxScore: JSON.parse(maxScore) }))
      .catch(error => {
        // console.log(error)
        this.setState(DEFAULT_STATE);
      })
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }

  componentWillUnmount() {
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
    return (
        <GameFrameComponent/>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});