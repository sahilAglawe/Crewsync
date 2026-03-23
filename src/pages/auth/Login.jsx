import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE = "http://localhost:8080";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      // Call the backend login API
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const user = response.data;

      // Successful login
      console.log("Login successful for user:", user);

      // Save login status, user data, and JWT token
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name || "");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("token", user.token);          // ← JWT token

      // Store full user data if needed
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("loginSuccess", "true");

      // Show success toast notification
      const roleName = user.role.charAt(0) + user.role.slice(1).toLowerCase();
      toast.success(
        `🎉 Welcome back, ${user.name || "User"}! Logged in as ${roleName}.`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // Navigate based on the user's role
      switch (user.role) {
        case "ADMIN":
          navigate("/admindashboard");
          break;
        case "ANALYST":
          navigate("/analystdashboard");
          break;
        case "TRAINER":
          navigate("/trainerdashboard");
          break;
        case "COUNSELOR":
          navigate("/counsellordashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please check if the server is running.");
      }
    } finally {
      setLoading(false);
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

        {/* Loading */}
        {loading && (
          <div className="text-center mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            >
              <option value="ADMIN">Admin</option>
              <option value="TRAINER">Trainer</option>
              <option value="ANALYST">Analyst</option>
              <option value="COUNSELOR">Counsellor</option>
            </select>
          </div>


          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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