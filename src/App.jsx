import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "../src/core/store/store";
import RoutesConfig from "./router/RoutesConfig";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "user/loadFromLocalStorage" });
  }, [dispatch]);

  return (
    <div className="container">
      <Header />
      <main className="wrapper">
        <Sidebar />
        <RoutesConfig />
      </main>
    </div>
  );
};

const AppWithStore = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWithStore;
