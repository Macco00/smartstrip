import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import Switch from "@mui/material/Switch";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SketchPicker } from "react-color";
import { GoDownload } from "react-icons/go";
import { CiCircleRemove } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";
import { NavLink } from "react-router-dom";

const DevicePageView = (props) => {
  function secondsToHHMM(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return formattedHours + ":" + formattedMinutes;
  }

  return (
    <div className="flex flex-col mx-16 mt-6 mb-6">
      <div className="flex items-center justify-center bg-ss-fg sm:h-96 h-56 rounded-[24px] mb-8">
        <div className="grid grid-cols-10 gap-x-2 gap-y-10 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 xl:gap-x-16 2xl:gap-x-24 sm:gap-y-20 w-max">
          {props.colors.map((item, index) => {
            const hexColor = "#" + item.toString(16).padStart(6, "0");
            return (
              <button
                key={index}
                onClick={(e) => {
                  props.onLedClick(index);
                }}
                className={
                  props.selectionMode === "individual" &&
                  props.selectedLed === index
                    ? "h-6 w-6 rounded-lg sm:h-8 sm:w-8 sm:rounded-xl lg:h-10 lg:w-10 lg:rounded-2xl ring-2 ring-[#3584e4] ring-offset-2 ring-offset-current"
                    : props.selectionMode === "full"
                    ? "h-6 w-6 rounded-lg sm:h-8 sm:w-8 sm:rounded-xl lg:h-10 lg:w-10 lg:rounded-2xl cursor-default"
                    : "h-6 w-6 rounded-lg sm:h-8 sm:w-8 sm:rounded-xl lg:h-10 lg:w-10 lg:rounded-2xl"
                }
                style={{ backgroundColor: hexColor }}
              ></button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-around">
        <div className="lg:w-1/2 flex justify-center items-center">
          <SketchPicker
            color={props.color}
            onChange={(e) => {
              props.setColor(e.hex);
            }}
            disableAlpha={true}
            width={500}
            presetColors={[]}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col gap-10">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <span className="font-medium text-ss-gray">Save pattern</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label"
                  className="outline-none px-2 py-1 mb-2 w-full  bg-white"
                  onChange={(e) => {
                    props.setLabel(e.target.value);
                  }}
                />
                <button
                  onClick={(e) => {
                    props.onSavePattern(e);
                  }}
                >
                  {" "}
                  <GoDownload size={32} className="text-ss-gray" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <span className="font-medium text-ss-gray">Load pattern</span>
              <select
                onChange={(e) => {
                  props.onLoadPattern(e.target.value);
                }}
                className="px-2 py-1 mb-2"
                defaultValue={""}
              >
                <option value="" disabled>
                  Select pattern
                </option>
                <optgroup label="Saved patterns">
                  {props.patterns.map((item, index) => {
                    return (
                      <option
                        key={`pattern_${index}`}
                        value={`patterns_${index}`}
                      >
                        {item.label}
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="Predefined colors">
                  {props.predefined_colors.map((item, index) => {
                    return (
                      <option key={`color_${index}`} value={`colors_${index}`}>
                        {item.label}
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="Predefined gradients">
                  {props.predefined_gradients.map((item, index) => {
                    return (
                      <option
                        key={`gradient_${index}`}
                        value={`gradients_${index}`}
                      >
                        {item.label}
                      </option>
                    );
                  })}
                </optgroup>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2">
              <span className="font-medium text-ss-gray">LED mode</span>
              <select
                className="px-2 py-1 mb-2"
                onChange={(e) => {
                  props.setLedMode(e.target.value);
                }}
                value={props.ledMode || ""}
              >
                <option value="static">Static</option>
                <option value="blinking">Blinking</option>
                <option value="pulsating">Pulsating</option>
                <option value="moving">Moving</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-1/2">
              <span className="font-medium text-ss-gray">Selection Mode</span>
              {props.selectionMode === "full" ? (
                <div className="flex gap-2 font-medium text-white">
                  <div className="flex items-center justify-center w-28 h-8 bg-ss-green rounded-3xl hover:shadow-xl active:shadow-inner hover:bg-ss-green active:bg-ss-dark-green cursor-pointer transition duration-150 ease-in-out">
                    Full
                  </div>
                  <div
                    onClick={(e) => {
                      props.setSelectionMode("individual");
                    }}
                    className="flex items-center justify-center w-28 h-8 bg-ss-gray rounded-3xl hover:shadow-xl active:shadow-inner hover:bg-ss-green active:bg-ss-dark-green cursor-pointer transition duration-150 ease-in-out"
                  >
                    Individual
                  </div>
                </div>
              ) : props.selectionMode === "individual" ? (
                <div className="flex gap-2 font-medium text-white">
                  <div
                    onClick={(e) => {
                      props.setSelectionMode("full");
                    }}
                    className="flex items-center justify-center w-28 h-8 bg-ss-gray rounded-3xl hover:shadow-xl active:shadow-inner hover:bg-ss-green active:bg-ss-dark-green cursor-pointer transition duration-150 ease-in-out"
                  >
                    Full
                  </div>
                  <div className="flex items-center justify-center w-28 h-8 bg-ss-green rounded-3xl hover:shadow-xl active:shadow-inner hover:bg-ss-green active:bg-ss-dark-green cursor-pointer transition duration-150 ease-in-out">
                    Individual
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 font-medium text-white">
                  <div
                    onClick={(e) => props.setSelectionMode("full")}
                    className={`flex items-center justify-center w-28 h-8 rounded-3xl hover:shadow-xl active:shadow-inner cursor-pointer transition duration-150 ease-in-out ${
                      props.selectionMode === "full"
                        ? "bg-ss-green"
                        : props.selectionMode === "gradient"
                        ? "bg-ss-gray"
                        : "bg-ss-gray hover:bg-ss-green active:bg-ss-dark-green"
                    }`}
                  >
                    Full
                  </div>
                  <div
                    onClick={(e) => props.setSelectionMode("individual")}
                    className={`flex items-center justify-center w-28 h-8 rounded-3xl hover:shadow-xl active:shadow-inner cursor-pointer transition duration-150 ease-in-out ${
                      props.selectionMode === "individual"
                        ? "bg-ss-green"
                        : props.selectionMode === "gradient"
                        ? "bg-ss-gray"
                        : "bg-ss-gray hover:bg-ss-green active:bg-ss-dark-green"
                    }`}
                  >
                    Individual
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-1/2 justify-center">
              <span className="font-medium text-ss-gray">
                Generate gradient
              </span>
              <div className="flex gap-4">
                {props.selectionMode === "gradient" &&
                props.selectedGradient === 0 ? (
                  <button
                    className="h-8 w-16 rounded-sm ring-2 ring-[#3584e4] ring-offset-2 ring-offset-current"
                    style={{ backgroundColor: props.fromColor }}
                  />
                ) : (
                  <button
                    onClick={(e) => {
                      props.onGradientClick(0);
                      props.setSelectionMode("gradient");
                    }}
                    className="h-8 w-16 rounded-sm"
                    style={{ backgroundColor: props.fromColor }}
                  />
                )}
                <IoIosArrowRoundForward className="text-ss-gray" size={32} />
                {props.selectionMode === "gradient" &&
                props.selectedGradient === 1 ? (
                  <button
                    className="h-8 w-16 rounded-sm ring-2 ring-[#3584e4] ring-offset-2 ring-offset-current"
                    style={{ backgroundColor: props.toColor }}
                  />
                ) : (
                  <button
                    onClick={(e) => {
                      props.onGradientClick(1);
                      props.setSelectionMode("gradient");
                    }}
                    className="h-8 w-16 rounded-sm"
                    style={{ backgroundColor: props.toColor }}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <span className="font-medium text-ss-gray">Brightness</span>
              <input
                type="range"
                min="5"
                max="255"
                onChange={(e) => {
                  props.setBrightness(e.target.value);
                }}
                value={props.brightness || 255}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-1 items-center">
              <span className="font-medium text-ss-gray">Audio Control</span>
              <Switch
                checked={props.audioControl}
                onChange={props.onAudioControl}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>
          </div>

          <div
            onClick={props.onDisplay}
            className="flex items-center justify-center bg-ss-fg h-8 lg:h-full rounded-3xl hover:shadow-xl active:shadow-inner text-ss-gray hover:text-white hover:bg-ss-green active:bg-ss-dark-green cursor-pointer transition duration-150 ease-in-out"
          >
            <span className="font-medium lg:font-bold lg:text-2xl">
              Display
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 font-medium lg:font-bold lg:text-2xl text-ss-gray mt-8">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex gap-4 w-full h-16 items-center justify-center">
            <TimeField
              value={props.fromTime}
              onChange={(newValue) => props.setFromTime(newValue)}
              label="From"
              format="HH:mm"
            />
            <TimeField
              value={props.toTime}
              onChange={(newValue) => props.setToTime(newValue)}
              label="To"
              format="HH:mm"
            />
            {!props.fromTime ||
            !props.toTime ||
            (props.fromTime && isNaN(props.fromTime.$H)) ||
            (props.toTime && isNaN(props.toTime.$H)) ? (
              <button className="flex items-center justify-center w-36 font-medium bg-ss-fg h-full rounded-3xl text-ss-gray cursor-not-allowed">
                Schedule
              </button>
            ) : props.fromTime && props.toTime ? (
              <button
                onClick={props.onSchedule}
                className="flex items-center justify-center w-36 font-medium bg-ss-fg h-full rounded-3xl hover:shadow-xl active:shadow-inner text-ss-gray hover:text-white hover:bg-ss-green active:bg-ss-dark-green transition duration-150 ease-in-out"
              >
                Schedule
              </button>
            ) : null}

            {props.currentSchedule ? (
              <div className="flex gap-2 items-center">
                <span>
                  Curent Schedule: {secondsToHHMM(props.currentSchedule.start)}{" "}
                  - {secondsToHHMM(props.currentSchedule.end)}
                </span>
                <CiCircleRemove
                  size={32}
                  className="hover:text-red-600 hover:cursor-pointer"
                  onClick={props.onRemoveSchedule}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </LocalizationProvider>
        {props.isOnline ? (
          <button
            onClick={props.onDeviceStatusChange}
            className="h-8 lg:h-16 w-full bg-ss-fg rounded-3xl hover:text-white active:shadow-inner hover:bg-red-600 active:bg-red-700 transition duration-150 ease-in-out"
          >
            Turn off
          </button>
        ) : (
          <button
            onClick={props.onDeviceStatusChange}
            className="h-8 lg:h-16 w-full bg-ss-fg rounded-3xl hover:text-white active:shadow-inner hover:bg-ss-green active:bg-ss-dark-green transition duration-150 ease-in-out"
          >
            Turn on
          </button>
        )}
        <NavLink to="/dashboard">
          <button
            onClick={props.onDeviceRemoval}
            className="h-8 lg:h-16 w-full bg-ss-fg rounded-3xl hover:text-white active:shadow-inner hover:bg-red-600 active:bg-red-700 transition duration-150 ease-in-out cursor-pointer"
          >
            Remove device
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default DevicePageView;
