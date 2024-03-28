import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/HeaderComponent/Header';
import Login from './components/LoginComponent/Login';
import Registration from './components/RegistrationComponent/Registration';
import Sidebar from './components/SidebarComponent/Sidebar';
import HomePage from './Pages/MainPage/HomePage';
import Dashboard from './Pages/DashboardPage/Dashboard';
import Connections from './Pages/ConnectionsPage/Connections';
import Files from './Pages/FilesPage/Files';
import Charts from './Pages/ChartsPage/Charts';
import Wiki from './Pages/Wiki/Wiki';
import BestPractices from './Pages/BestPractices/BestPractices';
import Community from './Pages/CommunityPage/Community';

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
