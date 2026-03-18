
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Home from './pages/Home.jsx'
import Login from './pages/auth/login.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AnalystDashboard from './analyst/analystDashboard.jsx';
import axios from 'axios';
import CounsellorDashboard from './counsellor/counsellorDashboard.jsx';
import TrainerDashboard from './trainer/trainerDashboard.jsx';
import API from './api';
import Students from './Student.jsx';

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/students" element={<Students />} />
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
          <Route path="/trainerdashboard" element={
            <ProtectedRoute allowedRole="TRAINER"><TrainerDashboard /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

