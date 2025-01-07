import { NavLink } from "react-router-dom";
import AddProductCard from "../components/AddProductCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import AddProductPopup from "../components/AddProductPopup.jsx";
import { useState } from "react";

export default function DashboardView(props) {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  function setDeviceID(input) {
    console.log(props.currentDevice);
    props.currentDevice.id = input;
  }
  function setDeviceLabel(input) {
    props.currentDevice.label = input;
  }

  function addDevice() {
    togglePopup();
    console.log("view");
    props.addDevice();
  }

  return (
    <div className="flex flex-col mx-16 mt-6 mb-6">
      <div className="flex-1 mb-4">
        <span className="text-2xl text-white font-semibold">
          Welcome back, {props.displayName}
        </span>
      </div>
      <div className="flex-1 lg:grid grid-cols-3 flex flex-col gap-6">
        {props.devices.map((device) => {
          return (
            <NavLink key={device.id} to={device.id}>
              <ProductCard
                label={device.label}
                online={device.leds_active === true}
              />
            </NavLink>
          );
        })}
        {showPopup ? (
          <AddProductPopup
            onIDChange={setDeviceID}
            onLabelChange={setDeviceLabel}
            onAddDevice={addDevice}
          />
        ) : (
          <div onClick={togglePopup}>
            <AddProductCard />
          </div>
        )}
      </div>
    </div>
  );
}
