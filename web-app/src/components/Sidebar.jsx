import logo from "../assets/Logo.svg";
import "../index.css";
import { GoSearch } from "react-icons/go";
import { FiLogOut } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import SidebarDeviceCard from "./SidebarDeviceCard.jsx";
import { DASHBOARD_SIDEBAR_LINKS } from "../consts/navigation.jsx";

import { auth } from "/src/firebaseModel.js";
import { signOut } from "firebase/auth";

export default observer(function Sidebar(props) {
  const [searchText, setSearchText] = useState("");

  const onChange = (event) => {
    setSearchText(event.target.value);
  };

  function logoutClickACB() {
    if (auth.currentUser) {
      console.log("logged out" + auth.currentUser);
      signOut(auth);
    }
  }

  const filteredDevices = props.devices.filter((device) =>
    device.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col w-72 text-ss-gray h-full">
      <NavLink
        to="/dashboard"
        className="flex gap-2 justify-center h-16 p-4 border-b border-ss-fg"
      >
        <img src={logo} alt="Logo" />
        <span className="font-bold text-white text-xl">SmartStrip</span>
      </NavLink>
      <div className="flex flex-col border-b border-ss-fg font-medium text-base">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <div key={item.key} className="flex-1 pl-20">
            <NavLink
              to={item.path}
              className="flex items-center gap-2 h-16"
              end
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center h-16 pl-2 pt-2">
        <GoSearch size={24} />
        <input
          type="text"
          value={searchText}
          onChange={onChange}
          placeholder="Search"
          className="border-none outline-none bg-transparent font-medium"
        />
      </div>
      <div className="flex flex-col overflow-auto font-medium text-base h-full">
        {filteredDevices.map((device) => {
          return (
            <NavLink key={device.id} to={device.id}>
              <SidebarDeviceCard label={device.label} />
            </NavLink>
          );
        })}
      </div>
      <div className="flex gap-2 justify-center items-center h-16 mb-10 mt-2">
        <FiLogOut size={24} />
        <NavLink to="/">
          <span onClick={logoutClickACB} className="font-medium text-base">
            <button>Sign out</button>
          </span>
        </NavLink>
      </div>
    </div>
  );
});
