import PatternsView from "/src/views/patternsView.jsx";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

export default observer(function Patterns(props) {
  function setColors(input) {
    //console.log(input);
    props.model.setColors(input);
  }
  function setLabel(input) {
    //console.log(input);
    props.model.label = input;
  }
  function addPattern() {
    //console.log("colors");
    //console.log(props.model.colors);
    props.model.newPattern(props.model.label, props.model.colors, "static", 10);
  }
  function setDeviceID(input) {
    props.model.currentDevice.id = input;
  }
  function setDeviceLabel(input) {
    props.model.currentDevice.label = input;
  }

  function addDevice() {
    console.log(props.model.devices);
    console.log(props.model.currentDevice);
    // props.model.devices = [...props.model.devices, props.model.currentDevice];
    props.model.addDevice(
      props.model.currentDevice.id,
      props.model.currentDevice.label
    );
  }
  return (
    <PatternsView
      patterns={props.model.patterns}
      onPatternChange={setColors}
      onAddClick={addPattern}
      onLabelChange={setLabel}
      onDeviceIDChange={setDeviceID}
      onDeviceLabelChange={setDeviceLabel}
      onDeviceAddClick={addDevice}
    />
  );
});
