import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/header/Header';
import Login from './components/login/Login';
import Home from './pages/main/Home';
import Registration from './components/registration/Registration';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import Connections from './pages/connections/Connections';
import Files from './pages/files/Files';
import Charts from './pages/charts/Charts';
import Wiki from './pages/Wiki/Wiki';
import BestPractices from './pages/best_practices/BestPractices';
import Community from './pages/community/Community';

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
