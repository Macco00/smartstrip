import GameView from "/src/views/gameView.jsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { updateLedsActive } from "../firebaseModel";
export default observer(function Game(props) {
  function seqEquals(seq1, seq2) {
    for (let i = 0; i < seq1.length; i++) {
      if (seq1[i] !== seq2[i]) {
        return false;
      }
    }

    return true;
  }
  function buttonClick(color) {
    console.log(color);

    props.model.setAnswerSeq([...props.model.answerSeq, color]);
    if (props.model.seq.length == props.model.answerSeq.length) {
      console.log("=====");
      console.log(props.model.seq);
      console.log(props.model.answerSeq);
      if (seqEquals(props.model.seq, props.model.answerSeq)) {
        //win
        console.log("win");

        //props.model.gameScore = props.model.seqLength;
        props.model.gameScore += 1;
        props.model.seqLength += 1;

        startGame();
      } else {
        //lose
        if (props.model.gameDifficulty == "Easy") {
          if (props.model.gameScore > props.model.gameStatistics.bestGameEasy) {
            props.model.gameStatistics.bestGameEasy = props.model.gameScore;
          }
          const totScore =
            props.model.gameStatistics.avgScoreEasy *
              props.model.gameStatistics.attemptsEasy +
            props.model.gameScore;
          console.log(totScore);

          props.model.gameStatistics.avgScoreEasy =
            totScore / (props.model.gameStatistics.attemptsEasy + 1);
          props.model.gameStatistics.attemptsEasy += 1;
        }
        if (props.model.gameDifficulty == "Medium") {
          if (
            props.model.gameScore > props.model.gameStatistics.bestGameMedium
          ) {
            props.model.gameStatistics.bestGameMedium = props.model.gameScore;
          }
          const totScore =
            props.model.gameStatistics.avgScoreMedium *
              props.model.gameStatistics.attemptsMedium +
            props.model.gameScore;
          console.log(totScore);
          props.model.gameStatistics.avgScoreMedium =
            totScore / (props.model.gameStatistics.attemptsMedium + 1);
          props.model.gameStatistics.attemptsMedium += 1;
        }
        if (props.model.gameDifficulty == "Hard") {
          if (props.model.gameScore > props.model.gameStatistics.bestGameHard) {
            props.model.gameStatistics.bestGameHard = props.model.gameScore;
          }
          const totScore =
            props.model.gameStatistics.avgScoreHard *
              props.model.gameStatistics.attemptsHard +
            props.model.gameScore;
          console.log(totScore);
          props.model.gameStatistics.avgScoreHard =
            totScore / (props.model.gameStatistics.attemptsHard + 1);
          props.model.gameStatistics.attemptsHard += 1;
        }
        props.model.gameActive = "over";

        updateLedsActive(props.model.currentDeviceId, false);
      }
    }
  }

  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500" /*
    "#800080",
    "#008000",*/,
  ];

  //const [gameActive, setGameActive] = useState(false); // State to manage popup visibility
  function showWhite(colors) {
    const color = parseInt("#FFFFFF".slice(1), 16);
    props.model.setColors(Array(30).fill(color));
    props.model.updateDevice();
    //document.getElementById("colorDisplay").style.backgroundColor = "#FFFFFF";
    setTimeout(() => {
      displayColors(colors.splice(1));
    }, 500);
  }

  function displayColors(colors) {
    if (colors.length == 0) {
      props.model.gameActive = "true";
      return;
    }
    const color = parseInt(colors[0].slice(1), 16);

    props.model.setColors(Array(30).fill(color));
    props.model.updateDevice();

    //document.getElementById("colorDisplay").style.backgroundColor = colors[0]; // Change background color of element with id 'colorDisplay'
    console.log(document.getElementById("colorDisplay"));
    console.log(colors[0]); //Will be replaced by function showing color on LEDstrip

    setTimeout(() => {
      showWhite(colors);
    }, 1500);
    /*
    setTimeout(() => {
      displayColors(colors.splice(1));
    }, 1500);
    */
  }
  function getColorSequence(length) {
    let i;
    for (i = 0; i < length; i++) {
      console.log("tests");
      const randomIndex = Math.floor(
        Math.random() * props.model.gameColors.length
      );
      const randomColor = props.model.gameColors[randomIndex];
      //props.model.seq.push(randomColor);
      props.model.setSeq([...props.model.seq, randomColor]);
    }
    //return props.model.seq;
  }
  function delay() {
    setTimeout(() => {
      showWhite(colors);
    }, 1500);
  }
  function startGame() {
    //props.model.seq = getColorSequence(10);
    updateLedsActive(props.model.currentDeviceId, false);

    setTimeout(() => {
      props.model.seq = [];
      props.model.answerSeq = [];
      if (props.model.gameActive == "false") {
        //reset
        props.model.gameScore = 0;
        props.model.seqLength = 2;
      }

      if (props.model.gameDifficulty == "Easy") {
        props.model.gameColors = colors.slice(0, 3);
      }
      if (props.model.gameDifficulty == "Medium") {
        props.model.gameColors = colors.slice(0, 5);
      }
      if (props.model.gameDifficulty == "Hard") {
        props.model.gameColors = colors.slice(0, 7);
      }
      console.log(props.model.seq);
      getColorSequence(props.model.seqLength);

      displayColors([...props.model.seq]);
      if (props.model.currentDeviceId == null) {
        console.log("if");
        props.model.currentDeviceId = props.model.devices[0].id;
      }
      props.model.gameActive = "pending";
      updateLedsActive(props.model.currentDeviceId, true);
      //setGameActive(true);
    }, 1500);
  }
  function deviceClick(deviceID) {
    console.log(deviceID);
    console.log("deviceClick");
    //props.model.currentDevice = device;
    props.model.currentDeviceId = deviceID;
  }
  function difficultyClick(difficulty) {
    props.model.gameDifficulty = difficulty;
  }
  function tryAgain() {
    props.model.gameActive = "false";
    startGame();
  }
  function goToMenu() {
    props.model.gameActive = "false";
  }
  return (
    <GameView
      answerSeq={props.model.answerSeq}
      seq={props.model.seq}
      onButtonClick={buttonClick}
      onStartGame={startGame}
      gameActive={props.model.gameActive}
      colors={props.model.gameColors}
      gameScore={props.model.gameScore}
      highScore={props.model.highScore}
      devices={props.model.devices}
      onSelectDevice={deviceClick}
      onSelectDifficulty={difficultyClick}
      difficulty={props.model.gameDifficulty}
      statistics={props.model.gameStatistics}
      onTryAgain={tryAgain}
      onGoToMenu={goToMenu}
    />
  );
});
