import DashboardView from "/src/views/DashboardView.jsx";
import { observer } from "mobx-react-lite";

export default observer(function Dashboard(props) {
  function addDevice() {
    props.model.addDevice(
      props.model.currentDevice.id,
      props.model.currentDevice.label
    );
  }
  return (
    <DashboardView
      displayName={props.model.displayName}
      currentDevice={props.model.currentDevice}
      addDevice={addDevice}
      devices={props.model.devices}
    />
  );
});
