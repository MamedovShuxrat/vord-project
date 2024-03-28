import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/HeaderComponent/Header';
import Login from './components/LoginComponent/Login';
import Registration from './components/RegistrationComponent/Registration';
import Sidebar from './components/SidebarComponent/Sidebar';
import HomePage from './WebPages/MainPage/HomePage';
import Dashboard from './WebPages/DashboardPage/Dashboard';
import Connections from './WebPages/ConnectionsPage/Connections';
import Files from './WebPages/FilesPage/Files';
import Charts from './WebPages/ChartsPage/Charts';
import Wiki from './WebPages/Wiki/Wiki';
import BestPractices from './WebPages/BestPractices/BestPractices';
import Community from './WebPages/CommunityPage/Community';

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <main className="wrapper">
          <Sidebar />
          <Routes>
            <Route path="/" element={<HomePage />} />
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
