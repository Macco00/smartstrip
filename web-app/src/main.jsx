import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import appModel from "/src/appModel.js";
import {
  currentDeviceIdReaction,
  connectToFirebase,
} from "/src/firebaseModel.js";
import { reaction, configure, observable } from "mobx";
const reactiveModel = observable(appModel);

configure({ enforceActions: "observed" }); // All state that is observed somewhere needs to be changed through actions.
if (
  !new (class {
    x;
  })().hasOwnProperty("x")
)
  throw new Error("Transpiler is not configured correctly for MobX");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App model={reactiveModel} />
  </React.StrictMode>
);

window.myModel = reactiveModel;
connectToFirebase(reactiveModel, reaction);
currentDeviceIdReaction(reactiveModel);
