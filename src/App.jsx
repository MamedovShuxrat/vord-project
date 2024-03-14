import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/header/Header';
import Login from './components/login/Login';
import Home from './pages/main/Home';
import Registration from './components/registration/Registration';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </div>

    </>
  );
}

export default App;
