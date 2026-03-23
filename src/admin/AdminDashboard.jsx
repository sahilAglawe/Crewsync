import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "../api";

const API_URL = "http://localhost:8080";

// ─── Toast Components ──────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = { success: "#28a745", error: "#dc3545", warning: "#fd7e14", info: "#4a9eff" };
  const icons = { success: "bi-check-circle-fill", error: "bi-x-circle-fill", warning: "bi-exclamation-triangle-fill", info: "bi-info-circle-fill" };

  return (
    <div style={{
      background: "white", borderRadius: "12px", padding: "14px 20px", boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      display: "flex", alignItems: "center", gap: "12px", minWidth: "300px", maxWidth: "420px",
      borderLeft: `4px solid ${colors[toast.type] || colors.info}`,
      animation: "slideInRight 0.35s ease"
    }}>
      <i className={`bi ${icons[toast.type] || icons.info}`} style={{ color: colors[toast.type] || colors.info, fontSize: "1.2rem" }}></i>
      <span style={{ flex: 1, fontSize: "0.9rem", color: "#1a1e2b" }}>{toast.message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "1.1rem" }}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}

// ─── Add User Modal ─────────────────────────────────────────────────
const AddUserModal = ({ show, onClose, activeTab, newUser, setNewUser, editingUser, onSave, onCancel }) => {
  if (!show) return null;
  const handleSubmit = (e) => { e.preventDefault(); onSave(); };
  const roleLabel = activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1);

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className={`bi ${activeTab === "trainer" ? "bi-person-workspace" : activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"} me-2`} style={{ color: '#4a9eff' }}></i>
              {editingUser ? 'Edit' : 'Add New'} {roleLabel}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-12">
                  <h6 className="fw-bold mb-3"><i className="bi bi-person-badge me-2" style={{ color: '#4a9eff' }}></i>Basic Information</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" value={newUser.name}
                        onChange={e => setNewUser({ ...newUser, name: e.target.value })} required autoFocus />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Email <span className="text-danger">*</span></label>
                      <input type="email" className="form-control" value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Phone <span className="text-danger">*</span></label>
                      <input type="tel" className="form-control" value={newUser.phone}
                        onChange={e => setNewUser({ ...newUser, phone: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Password {!editingUser && <span className="text-danger">*</span>}</label>
                      <input type="password" className="form-control" value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                        required={!editingUser} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Joining Date</label>
                      <input type="date" className="form-control" value={newUser.joiningDate}
                        onChange={e => setNewUser({ ...newUser, joiningDate: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Salary</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input type="number" className="form-control" value={newUser.salary}
                          onChange={e => setNewUser({ ...newUser, salary: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Status</label>
                      <select className="form-select" value={newUser.status}
                        onChange={e => setNewUser({ ...newUser, status: e.target.value })}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 bg-light">
              <button type="button" className="btn btn-light px-4" onClick={onCancel}>Cancel</button>
              <button type="submit" className="btn text-white px-4" style={{ background: '#4a9eff', border: 'none' }}>
                {editingUser ? 'Update' : 'Add'} {roleLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Confirmation Modal ──────────────────────────────────────
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
              <button className="btn btn-light flex-grow-1 py-2" onClick={onClose} style={{ borderRadius: '10px' }}>Cancel</button>
              <button className="btn btn-danger flex-grow-1 py-2 text-white" onClick={onConfirm} style={{ borderRadius: '10px' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Logout Confirmation Modal ──────────────────────────────────────
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

// ─── View User Modal ────────────────────────────────────────────────
const ViewUserModal = ({ show, onClose, selectedUser, formatDate, formatSalary }) => {
  if (!show || !selectedUser) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-person-circle me-2" style={{ color: '#4a9eff' }}></i>Employee Details
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-3">
              <div className="col-12 text-center mb-3">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2" style={{ background: '#e6f0ff' }}>
                  <i className="bi bi-person-fill" style={{ fontSize: '2rem', color: '#4a9eff' }}></i>
                </div>
                <h5 className="fw-bold mb-1">{selectedUser.name}</h5>
                <span className={`badge ${selectedUser.role === "TRAINER" ? "bg-primary" :
                  selectedUser.role === "ANALYST" ? "bg-success" :
                    selectedUser.role === "COUNSELOR" ? "bg-warning" : "bg-danger"
                  } px-3 py-2`}>{selectedUser.role}</span>
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
                  <span className={`badge ${selectedUser.status === "Active" ? "bg-success" : "bg-secondary"} mt-1`}>{selectedUser.status}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 bg-light">
            <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ─── MAIN ADMIN DASHBOARD ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
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
  const [hoveredTab, setHoveredTab] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [filters, setFilters] = useState({ search: "", role: "all" });

  const [stats, setStats] = useState({
    totalUsers: 0, activeTrainers: 0, activeAnalysts: 0, activeCounselors: 0
  });

  const [newUser, setNewUser] = useState({
    name: "", email: "", phone: "", password: "", status: "Active",
    joiningDate: "", salary: "", expertise: "", batchCapacity: "",
    tools: "", analysisType: "", specialties: "", sessionMode: ""
  });

  const [editingUser, setEditingUser] = useState(null);

  // ─── Current user ──────────────────────────────────────────────
  const currentUser = {
    name: localStorage.getItem("userName") || "Admin",
    email: localStorage.getItem("userEmail") || "admin@example.com"
  };

  // ─── Toast helper ──────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Fetch users ───────────────────────────────────────────────
  useEffect(() => {
    fetchUsers();
  }, []);

  const mapStatus = (empstatus) => empstatus === "ACTIVE" ? "Active" : empstatus === "INACTIVE" ? "Inactive" : "Active";

  const fetchUsers = async () => {
    try {
      const [trainersRes, analystsRes, counsellorsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/trainers`),
        axios.get(`${API_URL}/api/admin/analysts`),
        axios.get(`${API_URL}/api/admin/counsellors`)
      ]);

      const trainers = trainersRes.data.map(u => ({ ...u, role: "TRAINER", status: mapStatus(u.empstatus) }));
      const analysts = analystsRes.data.map(u => ({ ...u, role: "ANALYST", status: mapStatus(u.empstatus) }));
      const counsellors = counsellorsRes.data.map(u => ({ ...u, role: "COUNSELOR", status: mapStatus(u.empstatus) }));

      const allUsers = [...trainers, ...analysts, ...counsellors];
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      updateStats(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("Failed to fetch users", "error");
    }
  };

  // Apply filters
  useEffect(() => {
    let result = users;
    if (filters.search) {
      result = result.filter(user =>
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.phone?.includes(filters.search) ||
        user.role?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.role && filters.role !== "all") {
      result = result.filter(user => user.role === filters.role);
    }
    setFilteredUsers(result);
  }, [filters, users]);

  const updateStats = (userList) => {
    setStats({
      totalUsers: userList.length,
      activeTrainers: userList.filter(u => u.role === "TRAINER" && u.status === "Active").length,
      activeAnalysts: userList.filter(u => u.role === "ANALYST" && u.status === "Active").length,
      activeCounselors: userList.filter(u => u.role === "COUNSELOR" && u.status === "Active").length,
    });
  };

  const resetFilters = () => { setFilters({ search: "", role: "all" }); };

  // ─── Add User ──────────────────────────────────────────────────
  const handleAddUser = (role) => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.password) {
      showToast("Please fill all required fields", "warning");
      return;
    }
    const endpointMap = { "TRAINER": "/api/admin/trainers", "ANALYST": "/api/admin/analysts", "COUNSELOR": "/api/admin/counsellors" };
    const endpoint = endpointMap[role];
    if (!endpoint) { showToast("Invalid role selected", "error"); return; }

    const newEntry = {
      name: newUser.name, email: newUser.email, phone: newUser.phone,
      password: newUser.password, joiningDate: newUser.joiningDate || null,
      salary: newUser.salary ? parseFloat(newUser.salary) : null,
      empstatus: newUser.status === "Inactive" ? "INACTIVE" : "ACTIVE"
    };

    axios.post(`${API_URL}${endpoint}`, newEntry)
      .then(() => { fetchUsers(); resetForm(); setShowAddModal(false); showToast(`${role.charAt(0) + role.slice(1).toLowerCase()} added successfully!`); })
      .catch(error => { console.error("Error adding user:", error); showToast("Failed to add user", "error"); });
  };

  // ─── Delete User ───────────────────────────────────────────────
  const handleDeleteClick = (user) => { setUserToDelete(user); setShowDeleteModal(true); };

  const confirmDelete = () => {
    if (userToDelete) {
      const endpointMap = { "TRAINER": "/api/admin/trainers", "ANALYST": "/api/admin/analysts", "COUNSELOR": "/api/admin/counsellors" };
      const endpoint = endpointMap[userToDelete.role];
      if (!endpoint) { showToast("Cannot delete this user type", "error"); setShowDeleteModal(false); return; }
      axios.delete(`${API_URL}${endpoint}/${userToDelete.id}`)
        .then(() => { fetchUsers(); setShowDeleteModal(false); setUserToDelete(null); showToast("User deleted successfully!"); })
        .catch(error => { console.error("Error deleting user:", error); showToast("Failed to delete user", "error"); });
    }
  };

  const cancelDelete = () => { setShowDeleteModal(false); setUserToDelete(null); };

  // ─── Edit User ─────────────────────────────────────────────────
  const handleEdit = (user) => {
    setEditingUser(user);
    // Set activeTab to the user's role (lowercase) so the modal title & endpoint are correct
    const roleTab = user.role.toLowerCase(); // TRAINER->trainer, ANALYST->analyst, COUNSELOR->counselor
    setActiveTab(roleTab);
    setNewUser({
      name: user.name, email: user.email, phone: user.phone, password: user.password || "",
      status: user.status, joiningDate: user.joiningDate || "", salary: user.salary || "",
      expertise: user.expertise || "", batchCapacity: user.batchCapacity || "",
      tools: user.tools || "", analysisType: user.analysisType || "",
      specialties: user.specialties || "", sessionMode: user.sessionMode || ""
    });
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;
    const endpointMap = { "TRAINER": "/api/admin/trainers", "ANALYST": "/api/admin/analysts", "COUNSELOR": "/api/admin/counsellors" };
    const endpoint = endpointMap[editingUser.role];
    if (!endpoint) { showToast("Cannot update this user type", "error"); return; }

    const updatedEntry = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      // Only send password if admin explicitly changed it
      password: newUser.password || editingUser.password,
      joiningDate: newUser.joiningDate || null,
      salary: newUser.salary ? parseFloat(newUser.salary) : null,
      empstatus: newUser.status === "Inactive" ? "INACTIVE" : "ACTIVE"
    };

    axios.put(`${API_URL}${endpoint}/${editingUser.id}`, updatedEntry)
      .then(() => { fetchUsers(); setEditingUser(null); resetForm(); setShowAddModal(false); showToast("User updated successfully!"); })
      .catch(error => {
        console.error("Error updating user:", error?.response?.data || error);
        showToast("Failed to update user: " + (error?.response?.data?.message || error.message || "Unknown error"), "error");
      });
  };

  const resetForm = () => {
    setNewUser({ name: "", email: "", phone: "", password: "", status: "Active", joiningDate: "", salary: "", expertise: "", batchCapacity: "", tools: "", analysisType: "", specialties: "", sessionMode: "" });
  };

  const handleView = (user) => { setSelectedUser(user); setShowViewModal(true); };

  const formatSalary = (salary) => {
    if (!salary) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(salary);
  };
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // ─── Logout ────────────────────────────────────────────────────
  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => { setShowLogoutModal(false); localStorage.clear(); navigate("/login"); };
  const cancelLogout = () => setShowLogoutModal(false);

  const handleCloseAddModal = () => { setShowAddModal(false); setEditingUser(null); resetForm(); };
  const handleCancelAddModal = () => { setShowAddModal(false); setEditingUser(null); resetForm(); };
  const handleSaveAddModal = () => { if (editingUser) { handleUpdate(); } else { handleAddUser(activeTab?.toUpperCase()); } };

  // ─── Sidebar tabs config ───────────────────────────────────────
  const sidebarTabs = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2", color: "#4a9eff" },
    { key: "trainer", label: "Trainers", icon: "bi-person-workspace", color: "#f5576c" },
    { key: "analyst", label: "Analysts", icon: "bi-graph-up", color: "#28a745" },
    { key: "counselor", label: "Counselors", icon: "bi-chat-heart", color: "#fd7e14" }
  ];

  const sidebarStyles = {
    navItem: { transition: "all 0.3s ease-in-out", cursor: "pointer", position: "relative", overflow: "hidden" },
    navItemActive: (color) => ({
      background: `linear-gradient(90deg, ${color}33 0%, ${color}10 100%)`,
      borderLeft: `4px solid ${color}`, boxShadow: `0 4px 15px ${color}22`, color
    }),
    navItemHover: (color) => ({
      transform: "translateX(6px)", background: `linear-gradient(90deg, ${color}22 0%, transparent 100%)`,
      borderLeft: `4px solid ${color}`, boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
    })
  };

  // ═══════════════════════════════════════════════════════════════
  // ─── RENDER ───────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .sidebar-tab { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .sidebar-tab:hover { transform: translateX(4px); }
      `}</style>

      {/* ─── Sidebar ──────────────────────────────────────────── */}
      <div className="text-white shadow-lg"
        style={{
          width: sidebarOpen ? "280px" : "70px",
          minHeight: "100vh", position: "fixed",
          background: "linear-gradient(180deg, #1a1e2b 0%, #141722 100%)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 1050, overflowX: "hidden", overflowY: "auto"
        }}>
        <div style={{ padding: sidebarOpen ? "1.5rem" : "1.5rem 0.7rem" }}>

          {/* Header: CrewSync + Toggle */}
          <div className="d-flex align-items-center mb-4" style={{ justifyContent: sidebarOpen ? "space-between" : "center" }}>
            {sidebarOpen && <h4 className="fw-bold mb-0" style={{ color: "#4a9eff", whiteSpace: "nowrap" }}>CrewSync</h4>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              style={{
                background: "rgba(255,255,255,0.08)", border: "none", color: "#4a9eff",
                width: "38px", height: "38px", borderRadius: "10px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", transition: "all 0.2s ease", flexShrink: 0
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <i className={`bi ${sidebarOpen ? "bi-chevron-left" : "bi-list"}`}></i>
            </button>
          </div>

          {/* Profile */}
          <div className={`${sidebarOpen ? "text-center" : "d-flex justify-content-center"} mb-4 p-2 rounded`}
            style={{
              transition: "all 0.3s ease", cursor: "default",
              background: hoveredTab === "profile" ? "rgba(255,255,255,0.05)" : "transparent"
            }}
            onMouseEnter={() => setHoveredTab("profile")} onMouseLeave={() => setHoveredTab(null)}
            title={!sidebarOpen ? `${currentUser.name} (Admin)` : undefined}>
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
              style={{
                width: sidebarOpen ? "80px" : "40px", height: sidebarOpen ? "80px" : "40px",
                background: "#2a2f3c", transition: "all 0.3s ease",
                transform: hoveredTab === "profile" ? "scale(1.05)" : "scale(1)",
                boxShadow: hoveredTab === "profile" ? "0 0 20px rgba(74,158,255,0.3)" : "none"
              }}>
              <i className="bi bi-shield-lock-fill" style={{ fontSize: sidebarOpen ? "2.2rem" : "1.2rem", color: "#4a9eff" }}></i>
            </div>
            {sidebarOpen && (
              <>
                <h6 className="text-white mb-1 mt-3">{currentUser.name}</h6>
                <p className="text-white-50 small mb-2">{currentUser.email}</p>
                <span className="badge px-3 py-2" style={{ background: 'linear-gradient(135deg, #dc3545, #c82333)' }}>Admin</span>
              </>
            )}
          </div>

          {sidebarOpen && <p className="text-white-50 small mb-4">Employee Management</p>}

          <nav className="nav flex-column">
            {sidebarTabs.map(tab => {
              const isActive = activeTab === tab.key;
              const isHovered = hoveredTab === tab.key;
              const accentColor = isActive ? tab.color : (isHovered ? tab.color : "white");

              return (
                <button key={tab.key}
                  className={`nav-link border-0 bg-transparent mb-2 py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                  onClick={() => { setActiveTab(tab.key); if (tab.key !== "dashboard") resetForm(); }}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  title={!sidebarOpen ? tab.label : undefined}
                  style={{
                    ...sidebarStyles.navItem, color: accentColor,
                    ...(isActive ? sidebarStyles.navItemActive(tab.color) : {}),
                    ...(isHovered && !isActive ? sidebarStyles.navItemHover(tab.color) : {})
                  }}>
                  <i className={`bi ${tab.icon} ${sidebarOpen ? "me-2" : ""}`}
                    style={{
                      fontSize: sidebarOpen ? undefined : "1.2rem",
                      transition: "all 0.25s ease", transform: isHovered ? "scale(1.2)" : "scale(1)",
                      color: accentColor, filter: isHovered && !isActive ? `drop-shadow(0 0 4px ${tab.color}88)` : "none"
                    }}></i>
                  {sidebarOpen && tab.label}
                  {sidebarOpen && tab.key !== "dashboard" && (
                    <span className="badge ms-auto" style={{
                      background: isActive ? tab.color : (isHovered ? tab.color : 'rgba(255,255,255,0.15)'),
                      transition: 'background 0.3s ease'
                    }}>{users.filter(u => u.role === tab.key.toUpperCase()).length}</span>
                  )}
                </button>
              );
            })}

            <hr className="my-3" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Logout */}
            <button className={`nav-link border-0 bg-transparent py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
              onClick={handleLogoutClick}
              onMouseEnter={() => setHoveredTab("logout")} onMouseLeave={() => setHoveredTab(null)}
              title={!sidebarOpen ? "Logout" : undefined}
              style={{
                ...sidebarStyles.navItem,
                color: hoveredTab === "logout" ? "#ff6b6b" : "white",
                ...(hoveredTab === "logout" ? {
                  background: "linear-gradient(90deg, rgba(255,107,107,0.18) 0%, transparent 100%)",
                  borderLeft: "4px solid #ff6b6b", transform: "translateX(4px)"
                } : {})
              }}>
              <i className={`bi bi-box-arrow-right ${sidebarOpen ? "me-2" : ""}`}
                style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transition: "all 0.25s ease", transform: hoveredTab === "logout" ? "scale(1.2)" : "scale(1)" }}></i>
              {sidebarOpen && "Logout"}
            </button>
          </nav>
        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────────────── */}
      <div className="flex-grow-1 p-4" style={{
        marginLeft: sidebarOpen ? "280px" : "70px",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>

        {/* ─── Dashboard Tab ─────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div>
            <h4 className="fw-bold mb-4" style={{ color: "#1a1e2b" }}>
              <i className="bi bi-speedometer2 me-2" style={{ color: '#4a9eff' }}></i>Dashboard Overview
            </h4>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: "bi-people-fill", bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
                { label: "Active Trainers", value: stats.activeTrainers, icon: "bi-person-workspace", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
                { label: "Active Analysts", value: stats.activeAnalysts, icon: "bi-graph-up", bg: "linear-gradient(135deg, #4a9eff 0%, #2774b0 100%)" },
                { label: "Active Counselors", value: stats.activeCounselors, icon: "bi-chat-heart-fill", bg: "linear-gradient(135deg, #84fab0 0%, #44c78e 100%)" }
              ].map((card, i) => (
                <div className="col-md-3" key={i}>
                  <div className="card border-0 shadow p-3 h-100" style={{ borderRadius: '12px', background: card.bg, color: 'white' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-white-50 mb-2">{card.label}</h6>
                        <h3 className="fw-bold mb-0">{card.value}</h3>
                      </div>
                      <i className={`bi ${card.icon} fs-1 text-white-50`}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="row g-4 mb-4">
              {[
                { label: "Add Trainer", icon: "bi-person-plus-fill", bg: "#f5576c", action: () => { setActiveTab("trainer"); setShowAddModal(true); } },
                { label: "Add Analyst", icon: "bi-graph-up-arrow", bg: "#28a745", action: () => { setActiveTab("analyst"); setShowAddModal(true); } },
                { label: "Add Counselor", icon: "bi-chat-heart-fill", bg: "#fd7e14", action: () => { setActiveTab("counselor"); setShowAddModal(true); } }
              ].map((item, idx) => (
                <div className="col-md-4" key={idx}>
                  <div className="card border-0 shadow h-100" onClick={item.action}
                    style={{ borderRadius: '12px', cursor: 'pointer', transition: 'all 0.25s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                    <div className="card-body text-center p-4">
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ width: '50px', height: '50px', background: item.bg }}>
                        <i className={`bi ${item.icon} text-white`} style={{ fontSize: '1.3rem' }}></i>
                      </div>
                      <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#1a1e2b' }}>{item.label}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="card border-0 shadow mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0"><i className="bi bi-funnel me-2" style={{ color: '#4a9eff' }}></i>Filters</h6>
                  <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
                    <i className="bi bi-arrow-repeat me-1"></i>Reset
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                      <input type="text" className="form-control border-0 bg-light" placeholder="Search by name, email, phone, or role..."
                        value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select bg-light border-0" value={filters.role}
                      onChange={e => setFilters({ ...filters, role: e.target.value })}>
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

            {/* Employee Directory Table */}
            <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div className="card-header bg-white border-0 py-3 px-4">
                <h6 className="fw-bold mb-0"><i className="bi bi-people me-2" style={{ color: '#4a9eff' }}></i>Employee Directory ({filteredUsers.length})</h6>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#1a1e2b', color: 'white' }}>
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
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td className="py-3 ps-4">
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                                <i className="bi bi-person-fill" style={{ color: '#4a9eff' }}></i>
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
                            <span className={`badge ${user.role === "TRAINER" ? "bg-primary" :
                              user.role === "ANALYST" ? "bg-success" :
                                user.role === "COUNSELOR" ? "bg-warning" : "bg-danger"
                              }`}>{user.role}</span>
                          </td>
                          <td className="py-3">{formatDate(user.joiningDate)}</td>
                          <td className="py-3 fw-semibold">{formatSalary(user.salary)}</td>
                          <td className="py-3">
                            <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>{user.status}</span>
                          </td>
                          <td className="py-3">
                            <button className="btn btn-sm btn-info text-white me-1" onClick={() => handleView(user)} style={{ borderRadius: '8px' }}>
                              <i className="bi bi-eye-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-warning text-white me-1" onClick={() => handleEdit(user)} style={{ borderRadius: '8px' }}>
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-danger text-white" onClick={() => handleDeleteClick(user)} style={{ borderRadius: '8px' }}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="7" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-3"></i>No employees found matching the filters</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── Role Management Tabs (Trainer/Analyst/Counselor) ─── */}
        {(activeTab === "trainer" || activeTab === "analyst" || activeTab === "counselor") && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold" style={{ color: "#1a1e2b" }}>
                <i className={`bi ${activeTab === "trainer" ? "bi-person-workspace" : activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"} me-2`}
                  style={{ color: sidebarTabs.find(t => t.key === activeTab)?.color }}></i>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h4>
              <button className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none', borderRadius: '10px' }}
                onClick={() => setShowAddModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </button>
            </div>

            <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ background: '#1a1e2b', color: 'white' }}>
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
                              <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{
                                  width: '34px', height: '34px',
                                  background: activeTab === "trainer" ? "#fce4ec" : activeTab === "analyst" ? "#e8f5e9" : "#fff3e0",
                                  flexShrink: 0
                                }}>
                                <i className={`bi ${activeTab === "trainer" ? "bi-person-workspace" : activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"}`}
                                  style={{ color: sidebarTabs.find(t => t.key === activeTab)?.color }}></i>
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
                            <span className={`badge ${activeTab === "trainer" ? "bg-primary" : activeTab === "analyst" ? "bg-success" : "bg-warning"}`}>{user.role}</span>
                          </td>
                          <td className="py-3">{formatDate(user.joiningDate)}</td>
                          <td className="py-3 fw-semibold">{formatSalary(user.salary)}</td>
                          <td className="py-3">
                            <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>{user.status}</span>
                          </td>
                          <td className="py-3">
                            <button className="btn btn-sm btn-info text-white me-1" onClick={() => handleView(user)} style={{ borderRadius: '8px' }}>
                              <i className="bi bi-eye-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-warning text-white me-1" onClick={() => handleEdit(user)} style={{ borderRadius: '8px' }}>
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-danger text-white" onClick={() => handleDeleteClick(user)} style={{ borderRadius: '8px' }}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <i className={`bi ${activeTab === "trainer" ? "bi-person-workspace" : activeTab === "analyst" ? "bi-graph-up" : "bi-chat-heart"} fs-1 d-block mb-3`}></i>
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
      <ViewUserModal show={showViewModal} onClose={() => setShowViewModal(false)} selectedUser={selectedUser} formatDate={formatDate} formatSalary={formatSalary} />
      <LogoutConfirmationModal show={showLogoutModal} onClose={cancelLogout} onConfirm={confirmLogout} />
      <AddUserModal show={showAddModal} onClose={handleCloseAddModal} onCancel={handleCancelAddModal} onSave={handleSaveAddModal}
        activeTab={activeTab} newUser={newUser} setNewUser={setNewUser} editingUser={editingUser} />
      <DeleteConfirmationModal show={showDeleteModal} onClose={cancelDelete} onConfirm={confirmDelete} userName={userToDelete?.name} />
    </div>
  );
};

export default AdminDashboard;