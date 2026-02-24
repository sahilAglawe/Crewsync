import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTrainers: 0,
    activeAnalysts: 0,
    activeCounselors: 0,
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    qualification: "",
    certifications: "",
    languages: "",
    availability: "Full-time",
    status: "Active",
    // Trainer specific
    trainingModules: "",
    batchSize: "",
    // Analyst specific
    toolsKnown: "",
    reportTypes: "",
    // Counselor specific
    counselingAreas: "",
    sessionTypes: ""
  });

  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then(response => {
        setUsers(response.data);
        updateStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Update Stats
  const updateStats = (userList) => {
    setStats({
      totalUsers: userList.length,
      activeTrainers: userList.filter(u => u.role === "TRAINER" && u.status === "Active").length,
      activeAnalysts: userList.filter(u => u.role === "ANALYST" && u.status === "Active").length,
      activeCounselors: userList.filter(u => u.role === "COUNSELOR" && u.status === "Active").length,
    });
  };

  // Add User
  const handleAddUser = (role) => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      alert("Please fill all required fields");
      return;
    }

    const newEntry = {
      ...newUser,
      role,
      id: Date.now(), // Temporary ID for frontend
    };

    axios.post("http://localhost:5000/users", newEntry)
      .then(response => {
        const updatedUsers = [...users, response.data];
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        setNewUser({
          name: "", email: "", phone: "", specialization: "", experience: "",
          qualification: "", certifications: "", languages: "", availability: "Full-time",
          status: "Active", trainingModules: "", batchSize: "", toolsKnown: "",
          reportTypes: "", counselingAreas: "", sessionTypes: ""
        });
      })
      .catch(error => {
        console.error("Error adding user:", error);
      });
  };

  // Delete User
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/users/${id}`)
      .then(() => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
        updateStats(updatedUsers);
      })
      .catch(error => {
        console.error("Error deleting user:", error);
      });
  };

  // Edit User
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser(user);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/users/${editingUser.id}`, newUser)
      .then(response => {
        const updatedUsers = users.map(user =>
          user.id === response.data.id ? response.data : user
        );
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        setEditingUser(null);
        setNewUser({
          name: "", email: "", phone: "", specialization: "", experience: "",
          qualification: "", certifications: "", languages: "", availability: "Full-time",
          status: "Active", trainingModules: "", batchSize: "", toolsKnown: "",
          reportTypes: "", counselingAreas: "", sessionTypes: ""
        });
      })
      .catch(error => {
        console.error("Error updating user:", error);
      });
  };

  // View
  const handleView = (user) => {
    const details = `
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Role: ${user.role}
Status: ${user.status}
Specialization: ${user.specialization || 'N/A'}
Experience: ${user.experience || 'N/A'} years
Qualification: ${user.qualification || 'N/A'}
Languages: ${user.languages || 'N/A'}
Availability: ${user.availability || 'N/A'}
${user.role === 'TRAINER' ? `
Training Modules: ${user.trainingModules || 'N/A'}
Batch Size: ${user.batchSize || 'N/A'}` : ''}
${user.role === 'ANALYST' ? `
Tools Known: ${user.toolsKnown || 'N/A'}
Report Types: ${user.reportTypes || 'N/A'}` : ''}
${user.role === 'COUNSELOR' ? `
Counseling Areas: ${user.counselingAreas || 'N/A'}
Session Types: ${user.sessionTypes || 'N/A'}` : ''}
    `;
    alert(details);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  // Render role-specific fields
  const renderRoleSpecificFields = () => {
    switch(activeTab) {
      case "trainer":
        return (
          <>
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  className="form-control border-0 bg-light"
                  placeholder="Training Modules"
                  value={newUser.trainingModules}
                  onChange={(e) => setNewUser({ ...newUser, trainingModules: e.target.value })}
                  style={{ borderRadius: "10px" }}
                />
                <label>Training Modules (comma separated)</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  className="form-control border-0 bg-light"
                  placeholder="Batch Size"
                  value={newUser.batchSize}
                  onChange={(e) => setNewUser({ ...newUser, batchSize: e.target.value })}
                  style={{ borderRadius: "10px" }}
                />
                <label>Batch Size</label>
              </div>
            </div>
          </>
        );
      case "analyst":
        return (
          <>
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  className="form-control border-0 bg-light"
                  placeholder="Tools Known"
                  value={newUser.toolsKnown}
                  onChange={(e) => setNewUser({ ...newUser, toolsKnown: e.target.value })}
                  style={{ borderRadius: "10px" }}
                />
                <label>Analytical Tools (comma separated)</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  className="form-control border-0 bg-light"
                  placeholder="Report Types"
                  value={newUser.reportTypes}
                  onChange={(e) => setNewUser({ ...newUser, reportTypes: e.target.value })}
                  style={{ borderRadius: "10px" }}
                />
                <label>Report Types (comma separated)</label>
              </div>
            </div>
          </>
        );
      case "counselor":
        return (
          <>
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  className="form-control border-0 bg-light"
                  placeholder="Counseling Areas"
                  value={newUser.counselingAreas}
                  onChange={(e) => setNewUser({ ...newUser, counselingAreas: e.target.value })}
                  style={{ borderRadius: "10px" }}
                />
                <label>Counseling Areas (comma separated)</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input 
                  className="form-control border-0 bg-light"
                  placeholder="Session Types"
                  value={newUser.sessionTypes}
                  onChange={(e) => setNewUser({ ...newUser, sessionTypes: e.target.value })}
                  style={{ borderRadius: "10px" }}
                />
                <label>Session Types (Individual/Group)</label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
      
      {/* Enhanced Sidebar with gradient */}
      <div 
        className="text-white shadow-lg" 
        style={{ 
          width: "280px", 
          minHeight: "100vh", 
          position: "fixed",
          background: "linear-gradient(180deg, #0d1b2a 0%, #1b263b 100%)",
          borderRight: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <div className="p-4">
          <h4 className="fw-bold mb-4" style={{ color: "#4a9eff" }}>CrewSync</h4>
          <p className="text-white-50 small mb-4">Admin Dashboard</p>

          <nav className="nav flex-column">
            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "dashboard" ? "bg-primary bg-opacity-25" : "hover-bg"
              }`}
              onClick={() => setActiveTab("dashboard")}
              style={{ transition: "all 0.3s" }}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "trainer" ? "bg-primary bg-opacity-25" : "hover-bg"
              }`}
              onClick={() => setActiveTab("trainer")}
            >
              <i className="bi bi-person-workspace me-2"></i>
              Manage Trainer
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "analyst" ? "bg-primary bg-opacity-25" : "hover-bg"
              }`}
              onClick={() => setActiveTab("analyst")}
            >
              <i className="bi bi-graph-up me-2"></i>
              Manage Analyst
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "counselor" ? "bg-primary bg-opacity-25" : "hover-bg"
              }`}
              onClick={() => setActiveTab("counselor")}
            >
              <i className="bi bi-chat-heart me-2"></i>
              Manage Counselor
            </button>

            <hr className="my-4 bg-white-50" />
            
            <button 
              className="nav-link text-danger text-start w-100 border-0 bg-transparent py-2 px-3 rounded hover-bg-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "280px" }}>
        
        {/* Enhanced Dashboard Stats */}
        {activeTab === "dashboard" && (
          <div>
            <h4 className="fw-bold mb-4" style={{ color: "#0d1b2a" }}>Dashboard Overview</h4>
            <div className="row g-4">
              <div className="col-md-3">
                <div 
                  className="card p-3 border-0 shadow-lg h-100"
                  style={{ 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "15px",
                    color: "white"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Total Users</h6>
                      <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                    </div>
                    <i className="bi bi-people fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div 
                  className="card p-3 border-0 shadow-lg h-100"
                  style={{ 
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    borderRadius: "15px",
                    color: "white"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Active Trainers</h6>
                      <h3 className="fw-bold mb-0">{stats.activeTrainers}</h3>
                    </div>
                    <i className="bi bi-person-workspace fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div 
                  className="card p-3 border-0 shadow-lg h-100"
                  style={{ 
                    background: "linear-gradient(135deg, #5ea9f0 0%, #2774b0 100%)",
                    borderRadius: "15px",
                    color: "white"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Active Analysts</h6>
                      <h3 className="fw-bold mb-0">{stats.activeAnalysts}</h3>
                    </div>
                    <i className="bi bi-graph-up fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <div 
                  className="card p-3 border-0 shadow-lg h-100"
                  style={{ 
                    background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
                    borderRadius: "15px",
                    color: "#1b263b"
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Active Counselors</h6>
                      <h3 className="fw-bold mb-0">{stats.activeCounselors}</h3>
                    </div>
                    <i className="bi bi-chat-heart fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee List Section */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold mb-0">All Employees</h6>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3">Name</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Phone</th>
                        <th className="py-3">Designation</th>
                        <th className="py-3">Specialization</th>
                        <th className="py-3">Experience</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td className="py-3 fw-semibold">{user.name}</td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3">{user.phone || 'N/A'}</td>
                            <td className="py-3">
                              <span className={`badge ${
                                user.role === "ADMIN" ? "bg-danger" :
                                user.role === "TRAINER" ? "bg-primary" :
                                user.role === "ANALYST" ? "bg-success" : "bg-warning"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3">{user.specialization || 'N/A'}</td>
                            <td className="py-3">{user.experience || 'N/A'} years</td>
                            <td className="py-3">
                              <span className={`badge ${
                                user.status === "Active" ? "bg-success" : "bg-secondary"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced ROLE MANAGEMENT */}
        {(activeTab === "trainer" || activeTab === "analyst" || activeTab === "counselor") && (
          <div>
            <h4 className="fw-bold mb-4" style={{ color: "#0d1b2a" }}>
              <i className={`bi ${
                activeTab === "trainer" ? "bi-person-workspace" :
                activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"
              } me-2`}></i>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h4>

            {/* Enhanced Add Form */}
            <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: "15px" }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: "#1b263b" }}>
                  {editingUser ? "Edit User" : "Add New User"}
                </h6>
                <div className="row g-3">
                  {/* Basic Information */}
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Full Name *</label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Email Address"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Email Address *</label>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Phone Number"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Phone Number *</label>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Specialization"
                        value={newUser.specialization}
                        onChange={(e) => setNewUser({ ...newUser, specialization: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      />
                      <label>Specialization</label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <select 
                        className="form-control border-0 bg-light"
                        value={newUser.experience}
                        onChange={(e) => setNewUser({ ...newUser, experience: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      >
                        <option value="">Select Experience</option>
                        <option value="0-1">0-1 years</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      <label>Experience</label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Qualification"
                        value={newUser.qualification}
                        onChange={(e) => setNewUser({ ...newUser, qualification: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      />
                      <label>Highest Qualification</label>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Certifications"
                        value={newUser.certifications}
                        onChange={(e) => setNewUser({ ...newUser, certifications: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      />
                      <label>Certifications</label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Languages"
                        value={newUser.languages}
                        onChange={(e) => setNewUser({ ...newUser, languages: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      />
                      <label>Languages Known</label>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-floating">
                      <select 
                        className="form-control border-0 bg-light"
                        value={newUser.availability}
                        onChange={(e) => setNewUser({ ...newUser, availability: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                      <label>Availability</label>
                    </div>
                  </div>

                  {/* Role-specific fields */}
                  {renderRoleSpecificFields()}

                  {/* Action Buttons */}
                  <div className="col-12 mt-3">
                    {editingUser ? (
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-success px-4 py-2 fw-bold"
                          onClick={handleUpdate}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Update User
                        </button>
                        <button 
                          className="btn btn-secondary px-4 py-2 fw-bold"
                          onClick={() => {
                            setEditingUser(null);
                            setNewUser({
                              name: "", email: "", phone: "", specialization: "", experience: "",
                              qualification: "", certifications: "", languages: "", availability: "Full-time",
                              status: "Active", trainingModules: "", batchSize: "", toolsKnown: "",
                              reportTypes: "", counselingAreas: "", sessionTypes: ""
                            });
                          }}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn w-100 py-3 fw-bold text-white"
                        onClick={() => handleAddUser(activeTab.toUpperCase())}
                        style={{ 
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none"
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add {activeTab}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="card border-0 shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#0d1b2a", color: "white" }}>
                    <tr>
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Phone</th>
                      <th className="py-3">Specialization</th>
                      <th className="py-3">Experience</th>
                      <th className="py-3">Availability</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === activeTab.toUpperCase()).map(user => (
                      <tr key={user.id} className="align-middle">
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                              style={{ width: "35px", height: "35px" }}
                            >
                              <i className="bi bi-person-fill text-primary"></i>
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">{user.phone || 'N/A'}</td>
                        <td className="py-3">{user.specialization || 'N/A'}</td>
                        <td className="py-3">{user.experience || 'N/A'}</td>
                        <td className="py-3">
                          <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                            {user.availability || 'Full-time'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"} bg-opacity-10 text-${user.status === "Active" ? "success" : "secondary"} px-3 py-2`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button 
                            className="btn btn-sm btn-info text-white me-2"
                            onClick={() => handleView(user)}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-warning text-white me-2"
                            onClick={() => handleEdit(user)}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger text-white"
                            onClick={() => handleDelete(user.id)}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.filter(u => u.role === activeTab.toUpperCase()).length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                          No {activeTab}s found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;