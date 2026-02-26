import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

// Move AddUserModal outside the main component
const AddUserModal = ({ 
  show, 
  onClose, 
  activeTab, 
  newUser, 
  setNewUser, 
  editingUser, 
  onSave,
  onCancel 
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 bg-primary text-white" style={{ borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title fw-bold">
              <i className={`bi ${
                activeTab === "trainer" ? "bi-person-workspace" :
                activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"
              } me-2`}></i>
              {editingUser ? 'Edit' : 'Add New'} {activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1)}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* Basic Information - Required Fields */}
                <div className="col-12">
                  <h6 className="fw-bold mb-3"><i className="bi bi-person-badge me-2"></i>Basic Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name <span className="text-danger">*</span></label>
                      <input 
                        type="text"
                        className="form-control"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email <span className="text-danger">*</span></label>
                      <input 
                        type="email"
                        className="form-control"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone Number <span className="text-danger">*</span></label>
                      <input 
                        type="tel"
                        className="form-control"
                        value={newUser.phone}
                        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Password <span className="text-danger">*</span></label>
                      <input 
                        type="password"
                        className="form-control"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Joining Date</label>
                      <input 
                        type="date"
                        className="form-control"
                        value={newUser.joiningDate}
                        onChange={(e) => setNewUser({ ...newUser, joiningDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Salary</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number"
                          className="form-control"
                          value={newUser.salary}
                          onChange={(e) => setNewUser({ ...newUser, salary: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Status</label>
                      <select 
                        className="form-select"
                        value={newUser.status}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Trainer Specific Fields - Only show for trainer tab */}
                {activeTab === "trainer" && (
                  <div className="col-12 mt-3">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-person-workspace me-2"></i>
                      Trainer Details
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Expertise</label>
                        <input 
                          type="text"
                          className="form-control"
                          value={newUser.expertise}
                          onChange={(e) => setNewUser({ ...newUser, expertise: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Batch Capacity</label>
                        <input 
                          type="text"
                          className="form-control"
                          value={newUser.batchCapacity}
                          onChange={(e) => setNewUser({ ...newUser, batchCapacity: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer border-0 bg-light">
              <button 
                type="button" 
                className="btn btn-light px-4" 
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4"
              >
                {editingUser ? 'Update' : 'Add'} {activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ show, onClose, onConfirm, userName }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Confirm Delete</h5>
              <p className="text-muted mb-0">
                Are you sure you want to delete <span className="fw-bold text-dark">{userName}</span>?<br />
                This action cannot be undone.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light flex-grow-1 py-2" 
                onClick={onClose}
                style={{ borderRadius: '10px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger flex-grow-1 py-2 text-white" 
                onClick={onConfirm}
                style={{ borderRadius: '10px' }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Logout Confirmation Modal
const LogoutConfirmationModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-box-arrow-right text-warning" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Confirm Logout</h5>
              <p className="text-muted mb-0">Are you sure you want to logout?</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light flex-grow-1 py-2" onClick={onClose}>Cancel</button>
              <button className="btn btn-warning flex-grow-1 py-2 text-white" onClick={onConfirm}>Yes, Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// View Modal Component
const ViewUserModal = ({ show, onClose, selectedUser, formatDate, formatSalary }) => {
  if (!show || !selectedUser) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 bg-light">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-circle me-2"></i>
              Employee Details
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-3">
              <div className="col-12 text-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-2">
                  <i className="bi bi-person-fill text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="fw-bold mb-1">{selectedUser.name}</h5>
                <span className={`badge ${
                  selectedUser.role === "TRAINER" ? "bg-primary" :
                  selectedUser.role === "ANALYST" ? "bg-success" : "bg-warning"
                } px-3 py-2`}>
                  {selectedUser.role}
                </span>
              </div>

              <div className="col-md-6">
                <div className="bg-light p-3 rounded-3">
                  <small className="text-muted d-block">Email</small>
                  <span className="fw-semibold">{selectedUser.email}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 rounded-3">
                  <small className="text-muted d-block">Phone</small>
                  <span className="fw-semibold">{selectedUser.phone}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 rounded-3">
                  <small className="text-muted d-block">Joining Date</small>
                  <span className="fw-semibold">{formatDate(selectedUser.joiningDate)}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="bg-light p-3 rounded-3">
                  <small className="text-muted d-block">Salary</small>
                  <span className="fw-semibold">{formatSalary(selectedUser.salary)}</span>
                </div>
              </div>
              <div className="col-12">
                <div className="bg-light p-3 rounded-3">
                  <small className="text-muted d-block">Status</small>
                  <span className={`badge ${selectedUser.status === "Active" ? "bg-success" : "bg-secondary"} mt-1`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
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
    password: "",
    status: "Active",
    joiningDate: "",
    salary: "",
    // Role specific fields
    expertise: "",
    batchCapacity: "",
    tools: "",
    analysisType: "",
    specialties: "",
    sessionMode: ""
  });

  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:5000/users")
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        updateStats(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  };

  // Apply filters
  useEffect(() => {
    let result = users;

    // Search filter
    if (filters.search) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.includes(filters.search) ||
        user.role?.toLowerCase().includes(filters.search.toLowerCase())
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
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }

    const roleSpecificData = role === "TRAINER" ? {
      expertise: newUser.expertise,
      batchCapacity: newUser.batchCapacity
    } : role === "ANALYST" ? {
      tools: newUser.tools,
      analysisType: newUser.analysisType
    } : {
      specialties: newUser.specialties,
      sessionMode: newUser.sessionMode
    };

    const newEntry = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
      status: newUser.status,
      joiningDate: newUser.joiningDate,
      salary: newUser.salary,
      role,
      ...roleSpecificData
    };

    axios.post("http://localhost:5000/users", newEntry)
      .then(response => {
        fetchUsers(); // Refresh the list
        resetForm();
        setShowAddModal(false);
      })
      .catch(error => {
        console.error("Error adding user:", error);
      });
  };

  // Delete User
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      axios.delete(`http://localhost:5000/users/${userToDelete.id}`)
        .then(() => {
          fetchUsers(); // Refresh the list
          setShowDeleteModal(false);
          setUserToDelete(null);
        })
        .catch(error => {
          console.error("Error deleting user:", error);
        });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Edit User
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      status: user.status,
      joiningDate: user.joiningDate || "",
      salary: user.salary || "",
      expertise: user.expertise || "",
      batchCapacity: user.batchCapacity || "",
      tools: user.tools || "",
      analysisType: user.analysisType || "",
      specialties: user.specialties || "",
      sessionMode: user.sessionMode || ""
    });
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;

    const roleSpecificData = editingUser.role === "TRAINER" ? {
      expertise: newUser.expertise,
      batchCapacity: newUser.batchCapacity
    } : editingUser.role === "ANALYST" ? {
      tools: newUser.tools,
      analysisType: newUser.analysisType
    } : {
      specialties: newUser.specialties,
      sessionMode: newUser.sessionMode
    };

    const updatedEntry = {
      ...editingUser,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      password: newUser.password,
      status: newUser.status,
      joiningDate: newUser.joiningDate,
      salary: newUser.salary,
      ...roleSpecificData
    };

    axios.put(`http://localhost:5000/users/${editingUser.id}`, updatedEntry)
      .then(response => {
        fetchUsers(); // Refresh the list
        setEditingUser(null);
        resetForm();
        setShowAddModal(false);
      })
      .catch(error => {
        console.error("Error updating user:", error);
      });
  };

  // Reset form
  const resetForm = () => {
    setNewUser({
      name: "", email: "", phone: "", password: "", status: "Active",
      joiningDate: "", salary: "", expertise: "", batchCapacity: "", 
      tools: "", analysisType: "", specialties: "", sessionMode: ""
    });
  };

  // View User Details (Modal)
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Format salary for display
  const formatSalary = (salary) => {
    if (!salary) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Modal handlers
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    resetForm();
  };

  const handleCancelAddModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    resetForm();
  };

  const handleSaveAddModal = () => {
    if (editingUser) {
      handleUpdate();
    } else {
      handleAddUser(activeTab?.toUpperCase());
    }
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
              onClick={() => {
                setActiveTab("trainer");
                resetForm();
              }}
            >
              <i className="bi bi-person-workspace me-2"></i>
              Trainers
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "analyst" ? "bg-primary" : "hover-bg"
              }`}
              onClick={() => {
                setActiveTab("analyst");
                resetForm();
              }}
            >
              <i className="bi bi-graph-up me-2"></i>
              Analysts
            </button>

            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded ${
                activeTab === "counselor" ? "bg-primary" : "hover-bg"
              }`}
              onClick={() => {
                setActiveTab("counselor");
                resetForm();
              }}
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

            {/* Filters */}
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
                        placeholder="Search by name, email, phone, or role..."
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

            {/* Employee List - Table Format */}
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
                        <th className="py-3">Joining Date</th>
                        <th className="py-3">Salary</th>
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
                              <small className="text-muted">{user.phone}</small>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${
                                user.role === "TRAINER" ? "bg-primary" :
                                user.role === "ANALYST" ? "bg-success" : 
                                user.role === "COUNSELOR" ? "bg-warning" : "bg-danger"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3">{formatDate(user.joiningDate)}</td>
                            <td className="py-3 fw-semibold">{formatSalary(user.salary)}</td>
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
                                onClick={() => handleDeleteClick(user)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
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
            {/* Header with Add Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold">
                <i className={`bi ${
                  activeTab === "trainer" ? "bi-person-workspace text-primary" :
                  activeTab === "analyst" ? "bi-graph-up text-success" : "bi-chat-heart text-warning"
                } me-2`}></i>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h4>
              <button 
                className="btn btn-primary px-4"
                style={{ borderRadius: '10px' }}
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New {activeTab}
              </button>
            </div>

            {/* Employee List - Table Format for Role Pages */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold mb-0">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} List</h6>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="py-3 ps-4">Employee</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Role</th>
                        <th className="py-3">Joining Date</th>
                        <th className="py-3">Salary</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => u.role === activeTab.toUpperCase()).length > 0 ? (
                        users.filter(u => u.role === activeTab.toUpperCase()).map(user => (
                          <tr key={user.id}>
                            <td className="py-3 ps-4">
                              <div className="d-flex align-items-center">
                                <div className={`rounded-circle p-2 me-2 ${
                                  activeTab === "trainer" ? "bg-primary" :
                                  activeTab === "analyst" ? "bg-success" : "bg-warning"
                                } bg-opacity-10`}>
                                  <i className={`bi ${
                                    activeTab === "trainer" ? "bi-person-workspace" :
                                    activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"
                                  } ${
                                    activeTab === "trainer" ? "text-primary" :
                                    activeTab === "analyst" ? "text-success" : "text-warning"
                                  }`}></i>
                                </div>
                                <div>
                                  <div className="fw-semibold">{user.name}</div>
                                  <small className="text-muted">ID: {user.id}</small>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <div>{user.email}</div>
                              <small className="text-muted">{user.phone}</small>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${
                                activeTab === "trainer" ? "bg-primary" :
                                activeTab === "analyst" ? "bg-success" : "bg-warning"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3">{formatDate(user.joiningDate)}</td>
                            <td className="py-3 fw-semibold">{formatSalary(user.salary)}</td>
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
                                onClick={() => handleDeleteClick(user)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-5 text-muted">
                            <i className={`bi ${
                              activeTab === "trainer" ? "bi-person-workspace" :
                              activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"
                            } fs-1 d-block mb-3`}></i>
                            No {activeTab}s found
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
      </div>

      {/* Modals */}
      <ViewUserModal 
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        selectedUser={selectedUser}
        formatDate={formatDate}
        formatSalary={formatSalary}
      />
      
      <LogoutConfirmationModal 
        show={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
      
      <AddUserModal 
        show={showAddModal}
        onClose={handleCloseAddModal}
        onCancel={handleCancelAddModal}
        onSave={handleSaveAddModal}
        activeTab={activeTab}
        newUser={newUser}
        setNewUser={setNewUser}
        editingUser={editingUser}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        userName={userToDelete?.name}
      />
    </div>
  );
};

export default AdminDashboard;