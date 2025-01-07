import { initializeApp } from "firebase/app";
import firebaseConfig from "/src/firebaseConfig.js";
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import { getDatabase, ref, set, get, onValue, update } from "firebase/database";
import { reaction } from "mobx";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const auth = getAuth(app);

const appDiv = document.getElementById("currUser");
const provider = new GoogleAuthProvider();

function persistenceToModel(/* TODO */ firebaseModel, model) {
  if (firebaseModel !== null && model !== null) {
    model.displayName ? firebaseModel.display_name : null;

    if (firebaseModel.devices) {
      const devicesArray = Object.keys(firebaseModel.devices).map(
        (deviceId) => {
          const device = firebaseModel.devices[deviceId];

          return {
            id: deviceId,
            ...device,
          };
        }
      );
      model.setDevices(devicesArray);
    }

    //model.highScore = firebaseModel.highScore ? firebaseModel.highScore : 0;
    model.gameStatistics = firebaseModel.statistics ? firebaseModel.statistics : 
    {    bestGameEasy: 0,
      bestGameMedium: 0,
      bestGameHard: 0,
      avgScoreEasy: 0,
      avgScoreMedium: 0,
      avgScoreHard: 0,
      attemptsEasy: 0,
      attemptsMedium: 0,
      attemptsHard:0,}

    firebaseModel.saved_patterns
      ? model.setPatterns(firebaseModel.saved_patterns)
      : model.setPatterns([]);
  }
  return Promise.resolve(model);
}

function modelToPersistence(model) {
  const devicesObject = model.devices.reduce((acc, device) => {
    const deviceId = device.id;

    const { leds_active, ...deviceWithoutLedsActive } = device;

    acc[deviceId] = { ...deviceWithoutLedsActive };

    return acc;
  }, {});

  const modelObject = {
    display_name: model.displayName,
    saved_patterns: model.patterns,
    devices: devicesObject,
    //highScore: model.highScore,
    statistics: model.gameStatistics
  };

  return modelObject;
}

function saveToFirebase(model) {
  if (model.ready) {
    const PATH = "users/" + model.currentUser;
    set(ref(db, PATH), modelToPersistence(model));
  }
}
function patternToPersistence(patternObject) {
  return {
    brightness: patternObject.brightness,
    colors: patternObject.colors,
    led_mode: patternObject.led_mode,
  };
}
function patternToDevice(deviceID, patternObject) {
  const PATH = "devices/" + deviceID + "/current_pattern";
  set(ref(db, PATH), patternToPersistence(patternObject));
}

function predefinedPatternsToModel(firebaseModel, model) {
  if (firebaseModel !== null && model !== null) {
    model.predefined_patterns = firebaseModel;
  }
  return Promise.resolve(model);
}
async function readModel2(model) {
  var PATH = "users/" + model.currentUser;

  model.ready = false;
  var snapshot = await get(ref(db, PATH));
  await persistenceToModel(snapshot.val(), model);

  //read predefined patterns
  PATH = "predefined_patterns";
  snapshot = await get(ref(db, PATH));
  await predefinedPatternsToModel(snapshot.val(), model);

  // For each device linked to account attach a listener on the leds_active field
  model.devices.map((device, index) => {
    const ledsActiveRef = ref(db, "devices/" + device.id + "/leds_active");
    onValue(ledsActiveRef, (snapshot) => {
      const ledsActive = snapshot.val();
      const deviceObj = {
        ...device,
        leds_active: ledsActive,
      };
      const updatedDevices = [...model.devices];
      updatedDevices[index] = deviceObj;
      model.setDevices(updatedDevices);
    });
  });
  model.ready = true;
}

async function readLedsActive(deviceId) {
  const snapshot = await get(ref(db, "devices/" + deviceId + "/leds_active"));
  return snapshot.val();
}

function connectToFirebase(model, reaction) {
  onAuthStateChanged(auth, loginOrOutACB);

  async function loginOrOutACB(user) {
    model.ready = false;

    if (user) {
      model.setCurrentUser(user.uid);
      console.log("ifuser")
      console.log(user.displayName)
      model.setDisplayName(user.displayName);
      await readModel2(model);
      saveToFirebase(model); // save `displayName`
    } else {
      model.setCurrentUser(null);
      model.setDisplayName(null);
      model.setPatterns([]);
      model.setCurrentPattern(null);
      model.setDevices([]);
      //model.highScore = 0;

      model.ready = true;
    }
  }

  function getModelACB() {
    //från model
    return [
      model.displayName,
      model.patterns,
      model.devices,
      model.gameStatistics.attemptsEasy,
      model.gameStatistics.attemptsMedium,
      model.gameStatistics.attemptsHard,
    ];
  }
  function effectACB() {
    if (model.currentUser) {
      saveToFirebase(model);
    }
  }
  reaction(getModelACB, effectACB);
}

// Write start and end time for device to be scheduled
function scheduleDevice(deviceID, scheduleObj) {
  const PATH = "devices/" + deviceID + "/schedule";
  set(ref(db, PATH), scheduleObj);
}

function removeSchedule(deviceID) {
  const PATH = "devices/" + deviceID + "/schedule";
  set(ref(db, PATH), null);
}

// Update the audio_control_active field in firebase
function updateAudioControlActive(deviceID, audioControlActive) {
  const PATH = "devices/" + deviceID + "/audio_control_active";
  set(ref(db, PATH), audioControlActive);
}

// Retrieve the value of the audio_control_active field
async function readAudioControlActive(deviceID) {
  try {
    const PATH = "devices/" + deviceID + "/audio_control_active";
    const snapshot = await get(ref(db, PATH));
    const audioControlActive = snapshot.val();
    return audioControlActive;
  } catch (error) {
    console.error("Error reading audio_control_active:", error);
    return null;
  }
}

// Update the leds_active field in firebase
function updateLedsActive(deviceID, ledsActive) {
  const PATH = "devices/" + deviceID + "/leds_active";
  set(ref(db, PATH), ledsActive);
}

// Reaction to fetch device data when currentDeviceID changes
function currentDeviceIdReaction(model) {
  function watchCurrentDeviceIdCB() {
    return [model.currentDeviceId];
  }

  async function onCurrentDeviceIdChangeCB([newDeviceId]) {
    model.setCurrentPattern(null);
    model.setCurrentDeviceSchedule(null);
    const snapshot = await get(ref(db, "devices/" + newDeviceId));
    model.setCurrentPattern(snapshot.child("current_pattern").val());

    const scheduleRef = ref(db, "devices/" + newDeviceId + "/schedule");
    onValue(scheduleRef, (snapshot) => {
      const scheduleObj = snapshot.val();
      model.setCurrentDeviceSchedule(scheduleObj);
    });
  }
  reaction(watchCurrentDeviceIdCB, onCurrentDeviceIdChangeCB);
}

export {
  connectToFirebase,
  currentDeviceIdReaction,
  patternToDevice,
  scheduleDevice,
  removeSchedule,
  updateLedsActive,
  readLedsActive,
  updateAudioControlActive,
  readAudioControlActive,
};
