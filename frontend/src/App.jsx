import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminSignup from './pages/AdminSignup';
import Profile from './pages/Profile'; 
import Main from './pages/Main'; 
import Dashboard from './pages/Dashboard';
import EventRequests from './pages/EventRequests';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/index" element={<SideBar />}>
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="requests" element={<EventRequests />} /> 
          <Route path="main" element={<Main />} /> 
          <Route path="profile" element={<Profile />} /> 
        </Route>

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
