import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Simplified filters - only search and role
  const [filters, setFilters] = useState({
    search: "",
    role: "all"
  });

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
        setFilteredUsers(response.data);
        updateStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // Apply filters
  useEffect(() => {
    let result = users;

    // Search filter
    if (filters.search) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.includes(filters.search) ||
        user.specialization?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Role filter
    if (filters.role && filters.role !== "all") {
      result = result.filter(user => user.role === filters.role);
    }

    setFilteredUsers(result);
  }, [filters, users]);

  // Update Stats
  const updateStats = (userList) => {
    setStats({
      totalUsers: userList.length,
      activeTrainers: userList.filter(u => u.role === "TRAINER" && u.status === "Active").length,
      activeAnalysts: userList.filter(u => u.role === "ANALYST" && u.status === "Active").length,
      activeCounselors: userList.filter(u => u.role === "COUNSELOR" && u.status === "Active").length,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      role: "all"
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
      id: Date.now(),
    };

    axios.post("http://localhost:5000/users", newEntry)
      .then(response => {
        const updatedUsers = [...users, response.data];
        setUsers(updatedUsers);
        updateStats(updatedUsers);
        resetForm();
      })
      .catch(error => {
        console.error("Error adding user:", error);
      });
  };

  // Delete User
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:5000/users/${id}`)
        .then(() => {
          const updatedUsers = users.filter(user => user.id !== id);
          setUsers(updatedUsers);
          updateStats(updatedUsers);
        })
        .catch(error => {
          console.error("Error deleting user:", error);
        });
    }
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
        resetForm();
      })
      .catch(error => {
        console.error("Error updating user:", error);
      });
  };

  // Reset form
  const resetForm = () => {
    setNewUser({
      name: "", email: "", phone: "", specialization: "", experience: "",
      qualification: "", certifications: "", languages: "", availability: "Full-time",
      status: "Active", trainingModules: "", batchSize: "", toolsKnown: "",
      reportTypes: "", counselingAreas: "", sessionTypes: ""
    });
  };

  // View User Details (Modal)
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Logout handlers
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Render role-specific fields
  const renderRoleSpecificFields = () => {
    switch(activeTab) {
      case "trainer":
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Training Modules</label>
              <input 
                className="form-control"
                placeholder="e.g., React, Node.js, Python"
                value={newUser.trainingModules}
                onChange={(e) => setNewUser({ ...newUser, trainingModules: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Batch Size</label>
              <input 
                className="form-control"
                placeholder="e.g., 20-25"
                value={newUser.batchSize}
                onChange={(e) => setNewUser({ ...newUser, batchSize: e.target.value })}
              />
            </div>
          </>
        );
      case "analyst":
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Analytical Tools</label>
              <input 
                className="form-control"
                placeholder="e.g., Excel, Tableau, Power BI"
                value={newUser.toolsKnown}
                onChange={(e) => setNewUser({ ...newUser, toolsKnown: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Report Types</label>
              <input 
                className="form-control"
                placeholder="e.g., Financial, Marketing, Operations"
                value={newUser.reportTypes}
                onChange={(e) => setNewUser({ ...newUser, reportTypes: e.target.value })}
              />
            </div>
          </>
        );
      case "counselor":
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Counseling Areas</label>
              <input 
                className="form-control"
                placeholder="e.g., Career, Mental Health, Academic"
                value={newUser.counselingAreas}
                onChange={(e) => setNewUser({ ...newUser, counselingAreas: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small mb-1">Session Types</label>
              <select 
                className="form-select"
                value={newUser.sessionTypes}
                onChange={(e) => setNewUser({ ...newUser, sessionTypes: e.target.value })}
              >
                <option value="">Select Type</option>
                <option value="Individual">Individual</option>
                <option value="Group">Group</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Logout Confirmation Modal
  const LogoutConfirmationModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={cancelLogout}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-box-arrow-right text-warning" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Confirm Logout</h5>
              <p className="text-muted mb-0">Are you sure you want to logout from your account?</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light flex-grow-1 py-2" 
                onClick={cancelLogout}
                style={{ borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-warning flex-grow-1 py-2 text-white" 
                onClick={confirmLogout}
                style={{ borderRadius: '10px' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // View Modal Component
  const ViewUserModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowViewModal(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-person-circle me-2"></i>
                Employee Details
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                {/* Profile Header */}
                <div className="col-12 text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                    <i className="bi bi-person-fill text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="fw-bold mb-1">{selectedUser.name}</h4>
                  <span className={`badge ${
                    selectedUser.role === "ADMIN" ? "bg-danger" :
                    selectedUser.role === "TRAINER" ? "bg-primary" :
                    selectedUser.role === "ANALYST" ? "bg-success" : "bg-warning"
                  } px-3 py-2`}>
                    {selectedUser.role}
                  </span>
                </div>

                {/* Personal Information */}
                <div className="col-md-6">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-person-badge me-2"></i>Personal Info</h6>
                      <div className="mb-2"><span className="text-muted">Email:</span> {selectedUser.email}</div>
                      <div className="mb-2"><span className="text-muted">Phone:</span> {selectedUser.phone || 'N/A'}</div>
                      <div className="mb-2"><span className="text-muted">Languages:</span> {selectedUser.languages || 'N/A'}</div>
                      <div><span className="text-muted">Status:</span> 
                        <span className={`badge ${selectedUser.status === "Active" ? "bg-success" : "bg-secondary"} ms-2`}>
                          {selectedUser.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="col-md-6">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-briefcase me-2"></i>Professional Info</h6>
                      <div className="mb-2"><span className="text-muted">Specialization:</span> {selectedUser.specialization || 'N/A'}</div>
                      <div className="mb-2"><span className="text-muted">Experience:</span> {selectedUser.experience || 'N/A'}</div>
                      <div className="mb-2"><span className="text-muted">Qualification:</span> {selectedUser.qualification || 'N/A'}</div>
                      <div><span className="text-muted">Availability:</span> {selectedUser.availability || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Role Specific Details */}
                {selectedUser.role === "TRAINER" && (
                  <div className="col-12">
                    <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                      <div className="card-body">
                        <h6 className="fw-bold mb-3"><i className="bi bi-person-workspace me-2"></i>Trainer Details</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-2"><span className="text-muted">Training Modules:</span> {selectedUser.trainingModules || 'N/A'}</div>
                          </div>
                          <div className="col-md-6">
                            <div><span className="text-muted">Batch Size:</span> {selectedUser.batchSize || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === "ANALYST" && (
                  <div className="col-12">
                    <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                      <div className="card-body">
                        <h6 className="fw-bold mb-3"><i className="bi bi-graph-up me-2"></i>Analyst Details</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-2"><span className="text-muted">Tools Known:</span> {selectedUser.toolsKnown || 'N/A'}</div>
                          </div>
                          <div className="col-md-6">
                            <div><span className="text-muted">Report Types:</span> {selectedUser.reportTypes || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === "COUNSELOR" && (
                  <div className="col-12">
                    <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                      <div className="card-body">
                        <h6 className="fw-bold mb-3"><i className="bi bi-chat-heart me-2"></i>Counselor Details</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-2"><span className="text-muted">Counseling Areas:</span> {selectedUser.counselingAreas || 'N/A'}</div>
                          </div>
                          <div className="col-md-6">
                            <div><span className="text-muted">Session Types:</span> {selectedUser.sessionTypes || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {selectedUser.certifications && (
                  <div className="col-12">
                    <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                      <div className="card-body">
                        <h6 className="fw-bold mb-3"><i className="bi bi-award me-2"></i>Certifications</h6>
                        <div>{selectedUser.certifications}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer border-0 bg-light">
              <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      
      {/* Sidebar */}
      <div 
        className="text-white shadow" 
        style={{ 
          width: "260px", 
          minHeight: "100vh", 
          position: "fixed",
          background: "#1a1e2b",
        }}
      >
        <div className="p-4">
          <h5 className="fw-bold mb-4 text-primary">CrewSync</h5>
          <p className="text-white-50 small mb-4">Admin Dashboard</p>

          <nav className="nav flex-column">
            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "dashboard" ? "bg-primary" : "hover-bg"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "trainer" ? "bg-primary" : "hover-bg"
              }`}
              onClick={() => setActiveTab("trainer")}
            >
              <i className="bi bi-person-workspace me-2"></i>
              Trainers
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "analyst" ? "bg-primary" : "hover-bg"
              }`}
              onClick={() => setActiveTab("analyst")}
            >
              <i className="bi bi-graph-up me-2"></i>
              Analysts
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "counselor" ? "bg-primary" : "hover-bg"
              }`}
              onClick={() => setActiveTab("counselor")}
            >
              <i className="bi bi-chat-heart me-2"></i>
              Counselors
            </button>

            <hr className="my-4 bg-white-50" />
            
            <button 
              className="nav-link text-white text-start w-100 border-0 bg-transparent py-2 px-3 rounded"
              onClick={handleLogoutClick}
              style={{ color: '#ff6b6b' }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "260px" }}>
        
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h4 className="fw-bold mb-4">Dashboard Overview</h4>
            
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="d-flex justify-content-between align-items-center text-white">
                    <div>
                      <h6 className="text-white-50 mb-2">Total Users</h6>
                      <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
                    </div>
                    <i className="bi bi-people fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <div className="d-flex justify-content-between align-items-center text-white">
                    <div>
                      <h6 className="text-white-50 mb-2">Active Trainers</h6>
                      <h3 className="fw-bold mb-0">{stats.activeTrainers}</h3>
                    </div>
                    <i className="bi bi-person-workspace fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #5ea9f0 0%, #2774b0 100%)' }}>
                  <div className="d-flex justify-content-between align-items-center text-white">
                    <div>
                      <h6 className="text-white-50 mb-2">Active Analysts</h6>
                      <h3 className="fw-bold mb-0">{stats.activeAnalysts}</h3>
                    </div>
                    <i className="bi bi-graph-up fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
                  <div className="d-flex justify-content-between align-items-center" style={{ color: '#1a1e2b' }}>
                    <div>
                      <h6 className="text-white-50 mb-2">Active Counselors</h6>
                      <h3 className="fw-bold mb-0">{stats.activeCounselors}</h3>
                    </div>
                    <i className="bi bi-chat-heart fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified Filters - Only Search and Role */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Filters</h6>
                  <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
                    <i className="bi bi-arrow-repeat me-1"></i>Reset
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Search by name, email, phone, or specialization..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select bg-light border-0"
                      value={filters.role}
                      onChange={(e) => setFilters({...filters, role: e.target.value})}
                    >
                      <option value="all">All Roles</option>
                      <option value="TRAINER">Trainer</option>
                      <option value="ANALYST">Analyst</option>
                      <option value="COUNSELOR">Counselor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee List */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold mb-0">Employee Directory ({filteredUsers.length})</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 ps-4">Employee</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Role</th>
                        <th className="py-3">Specialization</th>
                        <th className="py-3">Experience</th>
                        <th className="py-3">Availability</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="py-3 ps-4">
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                                  <i className="bi bi-person-fill text-primary"></i>
                                </div>
                                <div>
                                  <div className="fw-semibold">{user.name}</div>
                                  <small className="text-muted">ID: {user.id}</small>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div>{user.email}</div>
                              <small className="text-muted">{user.phone || 'No phone'}</small>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${
                                user.role === "ADMIN" ? "bg-danger" :
                                user.role === "TRAINER" ? "bg-primary" :
                                user.role === "ANALYST" ? "bg-success" : "bg-warning"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3">{user.specialization || '-'}</td>
                            <td className="py-3">{user.experience || '-'}</td>
                            <td className="py-3">
                              <span className="badge bg-info bg-opacity-10 text-info">
                                {user.availability || 'Full-time'}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"} bg-opacity-10 text-${user.status === "Active" ? "success" : "secondary"}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <button 
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => handleView(user)}
                                title="View Details"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning me-1"
                                onClick={() => handleEdit(user)}
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(user.id)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                            No employees found matching the filters
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

        {/* Role Management Pages */}
        {(activeTab === "trainer" || activeTab === "analyst" || activeTab === "counselor") && (
          <div>
            <h4 className="fw-bold mb-4">
              <i className={`bi ${
                activeTab === "trainer" ? "bi-person-workspace" :
                activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"
              } me-2`}></i>
              Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s
            </h4>

            {/* Add/Edit Form */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">
                  {editingUser ? (
                    <><i className="bi bi-pencil-square me-2"></i>Edit User</>
                  ) : (
                    <><i className="bi bi-person-plus me-2"></i>Add New {activeTab}</>
                  )}
                </h6>
                
                <div className="row g-3">
                  {/* Row 1: Basic Info */}
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Full Name *</label>
                    <input 
                      className="form-control"
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Email Address *</label>
                    <input 
                      className="form-control"
                      type="email"
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Phone Number *</label>
                    <input 
                      className="form-control"
                      placeholder="Enter phone number"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                  </div>

                  {/* Row 2: Professional Info */}
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Specialization</label>
                    <input 
                      className="form-control"
                      placeholder="e.g., Web Development, Data Science"
                      value={newUser.specialization}
                      onChange={(e) => setNewUser({ ...newUser, specialization: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Experience</label>
                    <select 
                      className="form-select"
                      value={newUser.experience}
                      onChange={(e) => setNewUser({ ...newUser, experience: e.target.value })}
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Qualification</label>
                    <input 
                      className="form-control"
                      placeholder="e.g., B.Tech, MCA"
                      value={newUser.qualification}
                      onChange={(e) => setNewUser({ ...newUser, qualification: e.target.value })}
                    />
                  </div>

                  {/* Row 3: Additional Info */}
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Certifications</label>
                    <input 
                      className="form-control"
                      placeholder="e.g., AWS, PMP"
                      value={newUser.certifications}
                      onChange={(e) => setNewUser({ ...newUser, certifications: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Languages</label>
                    <input 
                      className="form-control"
                      placeholder="e.g., English, Spanish"
                      value={newUser.languages}
                      onChange={(e) => setNewUser({ ...newUser, languages: e.target.value })}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Availability</label>
                    <select 
                      className="form-select"
                      value={newUser.availability}
                      onChange={(e) => setNewUser({ ...newUser, availability: e.target.value })}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  {/* Role-specific fields */}
                  {renderRoleSpecificFields()}

                  {/* Status and Actions */}
                  <div className="col-md-4">
                    <label className="form-label text-muted small mb-1">Status</label>
                    <select 
                      className="form-select"
                      value={newUser.status}
                      onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-12 mt-4">
                    {editingUser ? (
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-primary px-4"
                          onClick={handleUpdate}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Update User
                        </button>
                        <button 
                          className="btn btn-outline-secondary px-4"
                          onClick={() => {
                            setEditingUser(null);
                            resetForm();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-primary px-4"
                        onClick={() => handleAddUser(activeTab.toUpperCase())}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add {activeTab}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Users List Table */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold mb-0">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List</h6>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 ps-4">Name</th>
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
                      <tr key={user.id}>
                        <td className="py-3 ps-4">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                              <i className="bi bi-person-fill text-primary"></i>
                            </div>
                            <span className="fw-semibold">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">{user.phone || '-'}</td>
                        <td className="py-3">{user.specialization || '-'}</td>
                        <td className="py-3">{user.experience || '-'}</td>
                        <td className="py-3">
                          <span className="badge bg-info bg-opacity-10 text-info">
                            {user.availability || 'Full-time'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"} bg-opacity-10 text-${user.status === "Active" ? "success" : "secondary"}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button 
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => handleView(user)}
                            title="View"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning me-1"
                            onClick={() => handleEdit(user)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
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

      {/* Modals */}
      {showViewModal && <ViewUserModal />}
      {showLogoutModal && <LogoutConfirmationModal />}
    </div>
  );
};

export default AdminDashboard;