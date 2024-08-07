import React from "react";
import RoutesConfig from "./router/RoutesConfig";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {

  return (
    <div className="container">
      <Header />
      <main className="wrapper">
        <Sidebar />
        <RoutesConfig />
      </main>
    </div>
  );
}

export default App;
