import "../index.css";
import logo from "../assets/Logo.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiLogOut } from "react-icons/fi";
import { DASHBOARD_SIDEBAR_LINKS } from "../consts/navigation.jsx";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

import { auth } from "/src/firebaseModel.js";
import { signOut } from "firebase/auth";

function Header(props) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleIsNavOpen = () => {
    setIsNavOpen(!isNavOpen);
  };
  function logoutClickACB() {
    //console.log("test"+props.user)
    if (auth.currentUser) {
      console.log("logged out" + auth.currentUser);
      signOut(auth);
    }
    // auth.currentUser ? signOut(auth) : signInWithPopup(auth, provider)
  }

  return (
    <div className="flex w-full h-full justify-center items-center relative">
      <NavLink to="/dashboard" className="absolute left-4 md:hidden">
        <img src={logo} alt="Logo" />
      </NavLink>
      <button
        className={`md:hidden text-white absolute right-4 transform transition-transform ${
          isNavOpen ? "rotate-180" : "rotate-0"
        }`}
        onClick={toggleIsNavOpen}
      >
        <RxHamburgerMenu size={32} />
      </button>
      {isNavOpen && (
        <div className="absolute flex flex-col items-center gap-2 font-medium text-base text-ss-gray top-full w-full bg-ss-bg border-y border-ss-fg z-20 md:hidden">
          {DASHBOARD_SIDEBAR_LINKS.map((item) => (
            <div key={item.key} className="flex-1">
              <NavLink
                to={item.path}
                className="flex items-center gap-2 h-16"
                onClick={toggleIsNavOpen}
                end
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </div>
          ))}
          <NavLink to="/">
            <div className="flex items-center gap-2 h-16">
              <FiLogOut size={24} />
              <span onClick={logoutClickACB} className="font-medium text-base">
                <button>Sign out</button>
              </span>
            </div>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default Header;
