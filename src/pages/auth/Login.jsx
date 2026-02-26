import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const storedAdmin = JSON.parse(localStorage.getItem("admin"));

  if (!storedAdmin) {
    setError("Admin not initialized.");
    return;
  }

  if (
    formData.email === storedAdmin.email &&
    formData.password === storedAdmin.password &&
    formData.role === "ADMIN"
  ) {
    // Save login status
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "ADMIN");

    navigate("/admindashboard");
  } else {
    setError("Invalid credentials or role");
  }
};


  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #0d1b2a, #1b263b)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          width: "100%",
          maxWidth: "420px",
          borderRadius: "15px",
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">CrewSync</h2>
          <p className="text-muted">Employee Management Login</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Role</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">Admin</option>
              <option value="TRAINER">Trainer</option>
              <option value="ANALYST">Analyst</option>
              <option value="COUNSELLOR">Counsellor</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
          >
            Login
          </button>
        </form>

        {/* Back to Home */}
        <div className="text-center mt-3">
          <small>
            <Link to="/" className="text-decoration-none">
              ← Back to Home
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;