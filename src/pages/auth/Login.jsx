import React, { useState, useEffect } from "react";
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
      // Fetch users from db.json using json-server
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();

      // Log the response to verify data structure
      console.log("Fetched users:", data);

      setUsers(data);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data. Please check if json-server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

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

      // Fetch fresh data directly from API to ensure we have latest data
      const response = await fetch("http://localhost:5000/users");
      const usersData = await response.json();

      // Find user with matching email and role
      const user = usersData.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase() &&
          u.role === formData.role
      );

      if (user) {
        // Check password
        if (user.password === formData.password) {
          // Successful login
          console.log("Login successful for user:", user);

          // Save login status and user data
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", user.role);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("userName", user.name || "");
          localStorage.setItem("userEmail", user.email);

          // Store full user data if needed
          localStorage.setItem("userData", JSON.stringify(user));

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
        } else {
          setError("Invalid password. Please try again.");
        }
      } else {
        setError("No account found with this email and role combination.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check if json-server is running.");
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, this function will show available users for each role
  const showDemoCredentials = () => {
    const usersByRole = {
      ADMIN: users.filter(u => u.role === "ADMIN"),
      ANALYST: users.filter(u => u.role === "ANALYST"),
      TRAINER: users.filter(u => u.role === "TRAINER"),
      COUNSELOR: users.filter(u => u.role === "COUNSELOR")
    };

    let message = "Demo Credentials:\n\n";

    if (usersByRole.ADMIN.length > 0) {
      message += "🔹 ADMIN:\n";
      usersByRole.ADMIN.forEach(u => {
        message += `   Email: ${u.email}\n`;
        message += `   Password: ${u.password || 'No password set'}\n`;
        message += `   Name: ${u.name || 'N/A'}\n\n`;
      });
    }

    if (usersByRole.ANALYST.length > 0) {
      message += "🔹 ANALYST:\n";
      usersByRole.ANALYST.forEach(u => {
        message += `   Email: ${u.email}\n`;
        message += `   Password: ${u.password || 'vijay123'}\n`;
        message += `   Name: ${u.name || 'N/A'}\n\n`;
      });
    }

    if (usersByRole.TRAINER.length > 0) {
      message += "🔹 TRAINER:\n";
      usersByRole.TRAINER.forEach(u => {
        message += `   Email: ${u.email}\n`;
        message += `   Password: ${u.password || 'No password set'}\n`;
        message += `   Name: ${u.name || 'N/A'}\n\n`;
      });
    }

    if (usersByRole.COUNSELOR.length > 0) {
      message += "🔹 COUNSELOR:\n";
      usersByRole.COUNSELOR.forEach(u => {
        message += `   Email: ${u.email}\n`;
        message += `   Password: ${u.password || 'shrikant'}\n`;
        message += `   Name: ${u.name || 'N/A'}\n\n`;
      });
    }

    if (message === "Demo Credentials:\n\n") {
      message = "No users found in the database. Please check if json-server is running.";
    }

    alert(message);
  };

  // Quick fill demo credentials based on selected role
  const fillDemoCredentials = () => {
    const roleUsers = users.filter(u => u.role === formData.role);
    if (roleUsers.length > 0) {
      const demoUser = roleUsers[0];
      setFormData({
        ...formData,
        email: demoUser.email,
        password: demoUser.password || ''
      });
    } else {
      alert(`No ${formData.role} users found in the database.`);
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
          {users.length > 0 && (
            <span className="badge bg-success"></span>
          )}
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



        {/* Server Status */}
        <div className="text-center mt-2">
          <small className="text-muted">
            {users.length === 0 && !loading && (
              <span className="text-warning">⚠️ Make sure json-server is running on port 5000</span>
            )}
          </small>
        </div>

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