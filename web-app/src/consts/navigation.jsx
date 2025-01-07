import { GoHome } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <GoHome size={24} />,
  },
  {
    key: "game",
    label: "Game",
    path: "/dashboard/game",
    icon: <IoGameControllerOutline size={30} />,
  },
];
