import React from "react";
import { Provider } from "react-redux";
import store from "../src/core/store/store";
import RoutesConfig from "./router/RoutesConfig";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {
  return (
    <Provider store={store}>
      <div className="container">
        <Header />
        <main className="wrapper">
          <Sidebar />
          <RoutesConfig />
        </main>
      </div>
      <Toaster />
    </Provider>
  );
}

export default App;
