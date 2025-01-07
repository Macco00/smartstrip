import { GoSun } from "react-icons/go";

const SidebarDeviceCard = (props) => {
  return (
    <div className="flex h-20 gap-2 items-center justify-center text-ss-gray hover:text-white overflow-hidden">
      <GoSun size={26} />
      <span className="font-medium text-base">{props.label}</span>
    </div>
  );
};

export default SidebarDeviceCard;
