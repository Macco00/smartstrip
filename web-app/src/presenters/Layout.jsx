import { Outlet, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

export default observer(function Layout(props) {
  if (!props.model.ready) {
    return (
      <div className="h-screen flex justify-center items-center">
        <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading..." />
      </div>
    );
  }

  if (!props.model.currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-row bg-ss-bg h-screen w-screen overflow-hidden font-poppins">
      <div className="bg-ss-sidebar border-r border-ss-fg hidden md:block">
        <Sidebar devices={props.model.devices} />
      </div>
      <div className="flex flex-col w-full">
        <div className="h-16 border-b border-ss-fg">{<Header />}</div>
        <div className="flex-1 overflow-auto">{<Outlet />}</div>
      </div>
    </div>
  );
});
