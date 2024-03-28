import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './Components/HeaderComponent/Header';
import Login from './Components/Login/Login';
import Home from './Pages/Main/Home';
import Registration from './Components/Registration/Registration';
import Sidebar from './Components/Sidebar/Sidebar';
import Dashboard from './Pages/Dashboard/Dashboard';
import Connections from './Pages/Connections/Connections';
import Files from './Pages/Files/Files';
import Charts from './Pages/Charts/Charts';
import Wiki from './Pages/Wiki/Wiki';
import BestPractices from './Pages/BestPractices/BestPractices';
import Community from './Pages/Community/Community';

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <main className="wrapper">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/files" element={<Files />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/best_practices" element={<BestPractices />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </main>
      </div>

    </>
  );
}

export default App;
