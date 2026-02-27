
import './App.css'
import { useEffect } from 'react';
import Home from './pages/Home.jsx'
import Login from './pages/auth/login.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AnalystDashboard from './analyst/analystDashboard.jsx';
import axios from 'axios';
import CounsellorDashboard from './counsellor/counsellorDashboard.jsx';

// Route guard — checks if user is logged in and has the correct role
function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  // Not logged in at all → go to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to the correct dashboard
  if (userRole !== allowedRole) {
    const roleRoutes = {
      ADMIN: "/admindashboard",
      ANALYST: "/analystdashboard",
      TRAINER: "/trainerdashboard",
      COUNSELOR: "/counsellordashboard"
    };
    const correctPath = roleRoutes[userRole] || "/login";
    return <Navigate to={correctPath} replace />;
  }

  return children;
}

function App() {

  const ADMIN_USER = {
    fullName: "Sahil Aglawe",
    username: "admin123",
    email: "admin@gmail.com",
    password: "admin123",
  };
  const admin = JSON.stringify(ADMIN_USER);
  localStorage.setItem("admin", admin);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admindashboard" element={
            <ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/analystdashboard" element={
            <ProtectedRoute allowedRole="ANALYST"><AnalystDashboard /></ProtectedRoute>
          } />
          <Route path="/counsellordashboard" element={
            <ProtectedRoute allowedRole="COUNSELOR"><CounsellorDashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

