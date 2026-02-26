import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch users from the endpoint
      const response = await axios.get("http://localhost:5000/users");
      
      // Log the response to verify data structure
      console.log("Fetched users:", response.data);
      
      setUsers(response.data);
      setError(""); // Clear any previous errors
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data. Please check if the server is running.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // If users haven't been fetched yet or fetch failed, try fetching again
      if (users.length === 0) {
        await fetchUsers();
      }

      // Find user with matching credentials and role
      // Note: Since the API doesn't return passwords, we'll use email and role only
      // In a real application, you would validate passwords on the backend
      const user = users.find(
        (u) => 
          u.email === formData.email && 
          u.role === formData.role
      );

      if (user) {
        // For demo purposes, we'll accept any password
        // In production, you should validate passwords on the backend
        
        // Save login status and user data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
        
        // Store full user data if needed
        localStorage.setItem("userData", JSON.stringify(user));

        // Navigate based on role
        switch(user.role) {
          case "ADMIN":
            navigate("/admindashboard");
            break;
          case "ANALYST":
            navigate("/analystdashboard");
            break;
          case "TRAINER":
            navigate("/trainerdashboard");
            break;
          case "COUNSELOR": // Note: In your data it's "COUNSELOR" not "COUNSELLOR"
            navigate("/counsellordashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        setError("Invalid email or role. Please check your credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, this function will show available users for each role
  const showAvailableUsers = () => {
    const usersByRole = {
      ADMIN: users.filter(u => u.role === "ADMIN"),
      ANALYST: users.filter(u => u.role === "ANALYST"),
      TRAINER: users.filter(u => u.role === "TRAINER"),
      COUNSELOR: users.filter(u => u.role === "COUNSELOR")
    };

    let message = "Available users for login:\n\n";
    
    if (usersByRole.ADMIN.length > 0) {
      message += "ADMIN:\n";
      usersByRole.ADMIN.forEach(u => message += `  - ${u.email} (${u.name})\n`);
    }
    
    if (usersByRole.ANALYST.length > 0) {
      message += "\nANALYST:\n";
      usersByRole.ANALYST.forEach(u => message += `  - ${u.email} (${u.name})\n`);
    }
    
    if (usersByRole.TRAINER.length > 0) {
      message += "\nTRAINER:\n";
      usersByRole.TRAINER.forEach(u => message += `  - ${u.email} (${u.name})\n`);
    }
    
    if (usersByRole.COUNSELOR.length > 0) {
      message += "\nCOUNSELOR:\n";
      usersByRole.COUNSELOR.forEach(u => message += `  - ${u.email} (${u.name})\n`);
    }

    alert(message || "No users found in the database.");
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