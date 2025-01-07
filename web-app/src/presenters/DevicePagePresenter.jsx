import DevicePageView from "/src/views/DevicePageView.jsx";
import {
  updateLedsActive,
  updateAudioControlActive,
  readAudioControlActive,
  scheduleDevice,
  removeSchedule,
} from "../firebaseModel";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default observer(function DevicePage(props) {
  const { pid } = useParams();

  function generateColorGradient(hex1, hex2) {
    const hexToRgb = (hex) => {
      let r = parseInt(hex.substring(0, 2), 16);
      let g = parseInt(hex.substring(2, 4), 16);
      let b = parseInt(hex.substring(4, 6), 16);
      return [r, g, b];
    };

    const interpolate = (start, end, step) => {
      return Math.round(start + (end - start) * step);
    };

    const startRgb = hexToRgb(hex1);
    const endRgb = hexToRgb(hex2);

    const steps = 30;
    const gradient = [];
    for (let i = 0; i < steps; i++) {
      let step = i / (steps - 1);
      let r = interpolate(startRgb[0], endRgb[0], step);
      let g = interpolate(startRgb[1], endRgb[1], step);
      let b = interpolate(startRgb[2], endRgb[2], step);

      let color24bit = (r << 16) | (g << 8) | b;
      gradient.push(color24bit);
    }

    console.log(gradient);
    return gradient;
  }

  const [selectedGradient, setSelectedGradient] = useState(null);
  const [fromColor, setFromColor] = useState("#ffffff");
  const [toColor, setToColor] = useState("#ffffff");

  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();

  const [audioControl, setAudioControl] = useState(false);

  // Update current device id in model
  useEffect(() => {
    props.model.setCurrentDeviceId(pid);

    const fetchData = async () => {
      const audioControlActive = await readAudioControlActive(pid);
      setAudioControl(audioControlActive);
    };

    fetchData();
  }, [pid]);

  useEffect(() => {
    console.log(props.model.color);
    if (props.model.color !== "") {
      const color = parseInt(props.model.color.slice(1), 16);
      if (props.model.selectionMode === "gradient") {
        if (selectedGradient === 0) {
          setFromColor(props.model.color);
        } else {
          setToColor(props.model.color);
        }
        props.model.setColors(
          generateColorGradient(fromColor.slice(1), toColor.slice(1))
        );
      } else if (props.model.selectionMode === "full") {
        props.model.setColors(Array(30).fill(color));
      } else if (props.model.currentLedIndex != null) {
        props.model.currentPattern.colors[props.model.currentLedIndex] = color;
      }
    }
  }, [props.model.color]);

  // Suspense if currentPattern is not set in model
  if (props.model.currentPattern === null) {
    return (
      <div className="h-full flex justify-center items-center">
        <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading..." />
      </div>
    );
  }

  const setColor = (color) => {
    props.model.setColor(color);
  };

  const setLedMode = (ledMode) => {
    props.model.setLedMode(ledMode);
  };

  const setBrightness = (brightness) => {
    props.model.setBrightness(parseInt(brightness, 10));
  };

  const setSelectionMode = (selectionMode) => {
    props.model.selectionMode = selectionMode;
  };

  const onDisplay = () => {
    props.model.updateDevice();
  };

  const onSchedule = () => {
    const scheduleObj = {
      start: fromTime.$H * 3600 + fromTime.$m * 60,
      end: toTime.$H * 3600 + toTime.$m * 60,
    };
    props.model.updateDevice();
    scheduleDevice(pid, scheduleObj);
  };

  const onRemoveSchedule = () => {
    removeSchedule(pid);
  };

  function setLabel(label) {
    props.model.setLabel(label);
  }
  function onSavePattern() {
    props.model.newPattern();
  }

  const onLedClick = (index) => {
    props.model.setCurrentLedIndex(index);
  };

  const onGradientClick = (index) => {
    setSelectedGradient(index);
  };

  const onLoadPattern = (object_index) => {
    console.log(object_index);
    const [object, index] = object_index.split("_");
    let patternObj;
    if (object == "patterns") {
      patternObj = { ...props.model.patterns[index] };
    } else {
      patternObj = { ...props.model.predefined_patterns[object][index] };
    }
    props.model.setCurrentPattern(patternObj);
  };

  const isOnline = props.model.devices.find(
    (device) => device.id === pid
  ).leds_active;

  const onAudioControl = () => {
    const newAudioControl = !audioControl;
    updateAudioControlActive(pid, newAudioControl);
    setAudioControl(newAudioControl);
  };

  const onDeviceStatusChange = () => {
    updateLedsActive(pid, !isOnline);
  };

  const onDeviceRemoval = () => {
    const updatedDevicesArray = props.model.devices.filter(
      (device) => device.id !== pid
    );
    props.model.setDevices([...updatedDevicesArray]);
  };

  return (
    <DevicePageView
      colors={props.model.currentPattern.colors}
      color={props.model.color}
      setColor={setColor}
      ledMode={props.model.currentPattern.led_mode}
      setLedMode={setLedMode}
      brightness={props.model.currentPattern.brightness}
      setBrightness={setBrightness}
      selectionMode={props.model.selectionMode}
      setSelectionMode={setSelectionMode}
      onLedClick={onLedClick}
      selectedLed={props.model.currentLedIndex}
      fromColor={fromColor}
      toColor={toColor}
      selectedGradient={selectedGradient}
      onGradientClick={onGradientClick}
      onDisplay={onDisplay}
      fromTime={fromTime}
      currentSchedule={props.model.currentDeviceSchedule}
      onRemoveSchedule={onRemoveSchedule}
      setFromTime={setFromTime}
      toTime={toTime}
      setToTime={setToTime}
      onSchedule={onSchedule}
      audioControl={audioControl}
      onAudioControl={onAudioControl}
      onLoadPattern={onLoadPattern}
      isOnline={isOnline}
      onDeviceStatusChange={onDeviceStatusChange}
      onDeviceRemoval={onDeviceRemoval}
      predefined_colors={props.model.predefined_patterns.colors}
      predefined_gradients={props.model.predefined_patterns.gradients}
      setLabel={setLabel}
      onSavePattern={onSavePattern}
      patterns={props.model.patterns}
    />
  );
});
