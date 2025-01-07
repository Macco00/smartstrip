import { useState } from "react";
import LeaderBoard from "../components/LeaderBoard.jsx";

export default function GameView(props) {
  function renderButtons(color) {
    return (
      <div key={color} style={{ display: "inline-block", margin: "5px" }}>
        <button
          onClick={(e) => {
            props.onButtonClick(color);
          }}
          //onClick={buttonClick(color)}
          className="rounded mb-2 p-16  "
          style={{ backgroundColor: color }}
        ></button>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-white flex items-center justify-center text-4xl font-bold mb-6 mt-6">
        Memory game
      </h1>

      {props.gameActive == "true" && (
        <div>
          <div className="flex items-center justify-center ">
            {props.colors.map(renderButtons)}
          </div>
          <div className="text-gray-500 font-mono text-2xl flex items-center justify-center ">
            {props.answerSeq.length + "/" + props.seq.length}
          </div>
        </div>
      )}
      {props.gameActive == "pending" && (
        <div className="flex items-center justify-center ">
          <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading..." />
        </div>
      )}
      {props.gameActive == "false" && (
        <div className="items-center justify-center flex">
          <div className="flex flex-col gap-1 w-1/2">
            <span className="font-medium text-ss-gray">Choose device</span>
            <select
              onChange={(e) => {
                props.onSelectDevice(e.target.value);
              }}
              className="px-2 py-1 mb-2"
              //defaultValue={""}
            >
              <option value="" disabled>
                Select device
              </option>
              <optgroup label="Devices">
                {props.devices.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.label}
                    </option>
                  );
                })}
              </optgroup>
            </select>
          </div>
        </div>
      )}

      {props.gameActive == "false" && (
        <div className="items-center justify-center flex">
          <div className="flex flex-col gap-1 w-1/2">
            <span className="font-medium text-ss-gray">Choose difficulty</span>
            <select
              onChange={(e) => {
                props.onSelectDifficulty(e.target.value);
              }}
              className="px-2 py-1 mb-6"
              //defaultValue={""}
            >
              <option value="" disabled>
                Select Difficulty
              </option>
              <optgroup label="Difficulty">
                <option key="East">Easy</option>
                <option key="Medium">Medium</option>
                <option key="Hard">Hard</option>
              </optgroup>
            </select>
          </div>
        </div>
      )}
      {props.gameActive == "false" && (
        <div className="items-center justify-center flex">
          <button
            onClick={(e) => {
              props.onStartGame();
            }}
            className="bg-green-500 hover:bg-green-700 text-white font-mono py-6 px-12 rounded text-xl mb-6"
          >
            Start game
          </button>
        </div>
      )}
      {props.gameActive == "over" && (
        <div>
          <h1 className="text-gray-500 flex items-center justify-center text-3xl font-mono mb-6 mt-6">
            Game Over!
          </h1>
          <div className="items-center justify-center flex">
            <button
              onClick={(e) => {
                props.onTryAgain();
              }}
              className="mx-4 bg-green-500 hover:bg-green-700 text-white font-mono py-6 px-12 rounded text-xl mb-6"
            >
              Try again
            </button>
            <button
              onClick={(e) => {
                props.onGoToMenu();
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-mono py-6 px-12 rounded text-xl mb-6"
            >
              Go to menu
            </button>
          </div>
        </div>
      )}

      {props.gameActive == "true" ||
      props.gameActive == "pending" ||
      props.gameActive == "over" ? (
        <h1 className="text-gray-500 flex items-center justify-center text-3xl font-mono mb-6">
          Score: {props.gameScore}
        </h1>
      ) : (
        <h1 className="text-grey flex items-center justify-center text-3xl font-bold mb-6"></h1>
      )}

      {props.gameActive == "false" || props.gameActive == "over" ? (
        <LeaderBoard statistics={props.statistics}></LeaderBoard>
      ) : (
        <div></div>
      )}
      {/*
      <div
        className="flex items-center justify-center"
        id="colorDisplay"
        style={{ width: "200px", height: "200px" }}
      ></div>
     */}
    </div>
  );
}
