import { TbError404Off } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const PageNotFoundView = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-ss-bg text-ss-gray">
      <TbError404Off size={256} />
      <NavLink
        to="/dashboard"
        className="flex items-center justify-center h-16 w-64 bg-ss-fg rounded-2xl shadow-xl"
      >
        <h1 className="hover:text-white font-extrabold text-3xl">
          Take me home
        </h1>
      </NavLink>
    </div>
  );
};

export default PageNotFoundView;
