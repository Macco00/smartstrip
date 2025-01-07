import { observable, action, toJS } from "mobx";
import { patternToDevice } from "/src/firebaseModel.js";
import { readLedsActive } from "./firebaseModel";

const appModel = {
  ready: false,
  setReady: action(function (value) {
    this.ready = value;
  }),
  setCurrentUser: action(function (value) {
    this.currentUser = value;
  }),
  setDisplayName: action(function (value) {
    this.displayName = value;
  }),
  displayName: null,
  currentUser: null,
  currentLedIndex: null,
  setCurrentLedIndex: action(function (index) {
    this.currentLedIndex = index;
  }),
  currentDeviceId: null,
  setCurrentDeviceId: action(function (pid) {
    this.currentDeviceId = pid;
  }),
  patterns: [],
  setPatterns: action(function (value) {
    this.patterns = value;
  }),
  currentPattern: {
    colors: [],
    led_mode: null,
    brightness: null,
    label: null,
  },
  setCurrentPattern: action(function (patternObject) {
    this.currentPattern = patternObject;
  }),
  setColors: action(function (colors) {
    this.currentPattern.colors = colors;
  }),
  setLedMode: action(function (ledMode) {
    this.currentPattern.led_mode = ledMode;
  }),
  setBrightness: action(function (brightness) {
    this.currentPattern.brightness = brightness;
  }),
  setLabel: action(function (label) {
    this.currentPattern.label = label;
  }),
  updateDevice: function () {
    patternToDevice(this.currentDeviceId, this.currentPattern);
  },
  currentDeviceSchedule: null,
  setCurrentDeviceSchedule: action(function (scheduleObj) {
    this.currentDeviceSchedule = scheduleObj;
  }),
  color: "",
  setColor: action(function (color) {
    this.color = color;
  }),
  selectionMode: "full",
  setSelectionMode: action(function (selectionMode) {
    this.selectionMode = selectionMode;
  }),
  newPattern: action(function () {
    //this.patterns = [...this.patterns, { ...this.currentPattern }];
    const patternsObj = toJS(this.currentPattern);
    //const patternsObj = structuredClone(this.currentPattern);
    this.patterns = [...this.patterns, patternsObj];
  }),
  devices: [],
  setDevices: action(function (devices) {
    this.devices = devices || [];
  }),
  currentDevice: {
    id: null,
    label: null,
  },
  async addDevice(id, label) {
    const device = {
      id: id,
      label: label,
    };
    this.devices = [...this.devices, device];

    // minimal wait to let reaction save `devices` before reading `leds_active`
    await new Promise((resolve) => setTimeout(resolve, 0));

    const leds_active = await readLedsActive(id);
    this.devices = this.devices.map((device) =>
      device.id === id ? { ...device, leds_active } : device
    );
  },
  predefined_patterns: {},
  answerSeq: [],
  setAnswerSeq: action(function (answerSeq) {
    this.answerSeq = answerSeq;
  }),
  seq: [],
  setSeq: action(function (seq) {
    this.seq = seq;
  }),
  gameActive: "false",
  gameScore: 0,


  seqLength: 2,
  gameDifficulty: "Easy",
  gameColors: [],

  gameStatistics:{
    bestGameEasy: 0,
    bestGameMedium: 0,
    bestGameHard: 0,
    avgScoreEasy: 0,
    avgScoreMedium: 0,
    avgScoreHard: 0,
    attemptsEasy: 0,
    attemptsMedium: 0,
    attemptsHard:0,
  }
};
export default appModel;
