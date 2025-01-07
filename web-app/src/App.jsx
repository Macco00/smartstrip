import Login from "./presenters/loginPresenter.jsx";
import Dashboard from "./presenters/DashboardPresenter.jsx";
import Settings from "./presenters/SettingsPresenter.jsx";
import Game from "./presenters/gamePresenter.jsx";

import Layout from "./presenters/Layout.jsx";
import DevicePage from "./presenters/DevicePagePresenter.jsx";
import Patterns from "./presenters/patternsPresenter.jsx";
import PageNotFound from "./presenters/PageNotFoundPresenter.jsx";
import { observer } from "mobx-react-lite";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function createRouter(props) {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<PageNotFound />}>
        <Route path="/" element={<Login model={props.model} />} />
        <Route path="dashboard" element={<Layout model={props.model} />}>
          <Route index element={<Dashboard model={props.model} />} />
          <Route path="game" element={<Game model={props.model} />} />
          <Route path=":pid" element={<DevicePage model={props.model} />} />
        </Route>
        <Route path="login" element={<Login model={props.model} />} />
        <Route path="patterns" element={<Patterns model={props.model} />} />
      </Route>
    )
  );
}

function App(props) {
  return <RouterProvider router={createRouter(props)} />;
}

export default observer(App);
