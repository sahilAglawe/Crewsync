
import './App.css'
import { useEffect } from 'react';
import Home from './pages/Home.jsx'
import Login from './pages/auth/login.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './admin/AdminDashboard.jsx';

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
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
