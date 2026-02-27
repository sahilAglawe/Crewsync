import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

// ─── Toast Components ──────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
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

// ─── View Batch Modal ───────────────────────────────────────────────
function ViewBatchModal({ show, batch, onClose }) {
  if (!show || !batch) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-eye me-2" style={{ color: '#4a9eff' }}></i>Batch Details
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-12 text-center mb-2">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '70px', height: '70px', background: '#e6f0ff' }}>
                  <i className="bi bi-collection-fill" style={{ fontSize: '2rem', color: '#4a9eff' }}></i>
                </div>
                <h4 className="fw-bold mb-1">{batch.batchName}</h4>
                <span className={`badge ${batch.status === "Ongoing" ? "bg-success" : batch.status === "Completed" ? "bg-secondary" : "bg-primary"} px-3 py-2`}>
                  {batch.status}
                </span>
              </div>
              <div className="col-md-6">
                <div className="card bg-light border-0" style={{ borderRadius: '12px' }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3"><i className="bi bi-info-circle me-2" style={{ color: '#4a9eff' }}></i>Basic Info</h6>
                    <div className="mb-2"><span className="text-muted">Course:</span> {batch.course}</div>
                    <div className="mb-2"><span className="text-muted">Trainer:</span> {batch.trainer}</div>
                    <div><span className="text-muted">Mode:</span> <span className={`badge ms-1 ${batch.mode === "Online" ? "bg-success" : batch.mode === "Offline" ? "bg-primary" : "bg-warning"}`}>{batch.mode}</span></div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-light border-0" style={{ borderRadius: '12px' }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3"><i className="bi bi-calendar me-2" style={{ color: '#4a9eff' }}></i>Schedule</h6>
                    <div className="mb-2"><span className="text-muted">Start:</span> {new Date(batch.startDate).toLocaleDateString()}</div>
                    <div className="mb-2"><span className="text-muted">End:</span> {new Date(batch.endDate).toLocaleDateString()}</div>
                    <div><span className="text-muted">Duration:</span> {Math.ceil((new Date(batch.endDate) - new Date(batch.startDate)) / (1000 * 60 * 60 * 24))} days</div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card bg-light border-0" style={{ borderRadius: '12px' }}>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3"><i className="bi bi-people me-2" style={{ color: '#4a9eff' }}></i>Enrollment</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Capacity</span>
                      <span className="fw-semibold">{batch.studentsEnrolled || 0} / {batch.maxStudents}</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${((batch.studentsEnrolled || 0) / batch.maxStudents) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light px-4 py-2" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ──────────────────────────────────────
function DeleteConfirmationModal({ show, item, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Delete Batch</h5>
              <p className="text-muted mb-0">Are you sure you want to delete "{item?.batchName}"? This action cannot be undone.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light flex-grow-1 py-2" onClick={onClose}>Cancel</button>
              <button className="btn btn-danger flex-grow-1 py-2" onClick={onConfirm}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Logout Confirmation Modal ──────────────────────────────────────
function LogoutConfirmationModal({ show, onClose, onConfirm }) {
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
}

// ─── Reports Coming Soon Modal ──────────────────────────────────────
function ReportsComingSoonModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
          <div className="modal-body text-center p-5">
            <div className="mb-4 position-relative">
              <div className="rounded-circle d-inline-flex p-4" style={{ background: '#e6f0ff' }}>
                <i className="bi bi-bar-chart-steps" style={{ fontSize: '4rem', color: '#4a9eff' }}></i>
              </div>
              <div className="position-absolute top-0 start-50 translate-middle">
                <span className="badge bg-warning text-white px-3 py-2 rounded-pill"><i className="bi bi-stars me-1"></i>New</span>
              </div>
            </div>
            <h3 className="fw-bold mb-3" style={{ background: 'linear-gradient(135deg, #4a9eff, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Reports Coming Soon!
            </h3>
            <p className="text-muted mb-4 px-3">We're building powerful analytics and insights. Stay tuned for performance reports, export features, and more.</p>
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="bg-light rounded-3 p-3">
                  <i className="bi bi-graph-up-arrow text-success fs-4 mb-2"></i>
                  <h6 className="mb-1">Performance</h6>
                  <small className="text-muted">Analytics</small>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light rounded-3 p-3">
                  <i className="bi bi-file-spreadsheet text-primary fs-4 mb-2"></i>
                  <h6 className="mb-1">Export Data</h6>
                  <small className="text-muted">PDF / Excel</small>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Development Progress</span>
                <span className="fw-semibold small" style={{ color: '#4a9eff' }}>75%</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar" style={{ width: '75%', background: '#4a9eff' }}></div>
              </div>
            </div>
            <button className="btn text-white px-5 py-2 rounded-pill" style={{ background: '#4a9eff' }} onClick={onClose}>
              <i className="bi bi-bell me-2"></i>Notify Me When Ready
            </button>
            <button className="btn btn-link text-muted d-block mx-auto mt-3 text-decoration-none" onClick={onClose}>
              Maybe Later <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── MAIN ANALYST DASHBOARD ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
const AnalystDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentUser = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName") || "Analyst",
    email: localStorage.getItem("userEmail") || "analyst@example.com",
    role: localStorage.getItem("role") || "ANALYST"
  };

  // Form state for batch
  const [newBatch, setNewBatch] = useState({
    batchName: "", course: "", trainer: "", startDate: "", endDate: "",
    maxStudents: "", mode: "Online", status: "Upcoming", studentsEnrolled: 0
  });
  const [editingBatch, setEditingBatch] = useState(null);

  // ─── Toast helper ──────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Fetch batches ─────────────────────────────────────────────
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/batches`);
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      showToast("Failed to fetch batches", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // ─── Stats ─────────────────────────────────────────────────────
  const stats = {
    totalBatches: batches.length,
    ongoingBatches: batches.filter(b => b.status === "Ongoing").length,
    completedBatches: batches.filter(b => b.status === "Completed").length,
    upcomingBatches: batches.filter(b => b.status === "Upcoming").length,
    totalStudents: batches.reduce((sum, b) => sum + (parseInt(b.studentsEnrolled) || 0), 0),
    occupancyRate: batches.length > 0
      ? Math.round((batches.reduce((s, b) => s + (parseInt(b.studentsEnrolled) || 0), 0) /
        batches.reduce((s, b) => s + (parseInt(b.maxStudents) || 0), 0)) * 100) : 0
  };

  // ─── Create Batch ──────────────────────────────────────────────
  const handleCreateBatch = async () => {
    if (!newBatch.batchName || !newBatch.course || !newBatch.trainer || !newBatch.startDate || !newBatch.endDate || !newBatch.maxStudents) {
      showToast("Please fill all required fields", "warning");
      return;
    }
    const batchData = {
      ...newBatch, id: Date.now().toString(), studentsEnrolled: 0,
      createdAt: new Date().toISOString(), createdBy: currentUser.name, createdById: currentUser.id
    };
    try {
      const response = await axios.post(`${API_URL}/batches`, batchData);
      setBatches([...batches, response.data]);
      resetForm();
      setActiveTab("dashboard");
      showToast("Batch created successfully!", "success");
    } catch (error) {
      console.error("Error creating batch:", error);
      showToast("Failed to create batch", "error");
    }
  };

  // ─── Edit Batch ────────────────────────────────────────────────
  const handleEditClick = (batch) => { setEditingBatch(batch); setNewBatch(batch); setActiveTab("create"); };

  const handleUpdateBatch = async () => {
    try {
      const response = await axios.put(`${API_URL}/batches/${editingBatch.id}`, newBatch);
      setBatches(batches.map(b => b.id === editingBatch.id ? response.data : b));
      setEditingBatch(null); resetForm(); setActiveTab("dashboard");
      showToast("Batch updated successfully!", "success");
    } catch (error) {
      console.error("Error updating batch:", error);
      showToast("Failed to update batch", "error");
    }
  };

  // ─── Delete Batch ──────────────────────────────────────────────
  const handleDeleteClick = (batch) => { setBatchToDelete(batch); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/batches/${batchToDelete.id}`);
      setBatches(batches.filter(b => b.id !== batchToDelete.id));
      setShowDeleteModal(false); setBatchToDelete(null);
      showToast("Batch deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting batch:", error);
      showToast("Failed to delete batch", "error");
    }
  };

  // ─── View Batch ────────────────────────────────────────────────
  const handleViewClick = (batch) => { setSelectedBatch(batch); setShowViewModal(true); };

  // ─── Reset form ────────────────────────────────────────────────
  const resetForm = () => {
    setNewBatch({ batchName: "", course: "", trainer: "", startDate: "", endDate: "", maxStudents: "", mode: "Online", status: "Upcoming", studentsEnrolled: 0 });
  };

  // ─── Logout ────────────────────────────────────────────────────
  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => { setShowLogoutModal(false); localStorage.clear(); navigate("/login"); };

  // ─── Sidebar styles ────────────────────────────────────────────
  const sidebarStyles = {
    navItem: { transition: "all 0.3s ease-in-out", cursor: "pointer", position: "relative", overflow: "hidden" },
    navItemHover: { transform: "translateX(5px)", backgroundColor: "rgba(74,158,255,0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", borderLeft: "4px solid #4a9eff" },
    navItemActive: { background: "linear-gradient(90deg, rgba(74,158,255,0.25) 0%, rgba(74,158,255,0.08) 100%)", borderLeft: "4px solid #4a9eff", boxShadow: "0 4px 15px rgba(74,158,255,0.15)", color: "#4a9eff" },
    logoutHover: { background: "linear-gradient(90deg, rgba(255,107,107,0.18) 0%, rgba(255,107,107,0.05) 100%)", color: "#ff6b6b", transform: "translateX(5px)", borderLeft: "4px solid #ff6b6b" }
  };

  const sidebarTabs = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2", badge: null, color: "#4a9eff" },
    { key: "create", label: "Create Batch", icon: "bi-plus-circle", badge: null, color: "#28a745" },
    { key: "batches", label: "All Batches", icon: "bi-collection", badge: batches.length, color: "#fd7e14" },
    { key: "reports", label: "Reports", icon: "bi-bar-chart-steps", badge: "Soon", color: "#8B5CF6", special: true }
  ];

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

      {/* ─── Sidebar ───────────────────────────────────────────── */}
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
            style={{ transition: "all 0.3s ease", cursor: "default", background: hoveredTab === "profile" ? "rgba(255,255,255,0.05)" : "transparent" }}
            onMouseEnter={() => setHoveredTab("profile")} onMouseLeave={() => setHoveredTab(null)}
            title={!sidebarOpen ? `${currentUser.name} (Analyst)` : undefined}>
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
              style={{
                width: sidebarOpen ? "80px" : "40px", height: sidebarOpen ? "80px" : "40px",
                background: "#2a2f3c", transition: "all 0.3s ease",
                transform: hoveredTab === "profile" ? "scale(1.05)" : "scale(1)",
                boxShadow: hoveredTab === "profile" ? "0 0 20px rgba(74,158,255,0.3)" : "none"
              }}>
              <i className="bi bi-person-fill" style={{ fontSize: sidebarOpen ? "2.5rem" : "1.2rem", color: "#4a9eff" }}></i>
            </div>
            {sidebarOpen && (
              <>
                <h6 className="text-white mb-1 mt-3">{currentUser.name}</h6>
                <p className="text-white-50 small mb-2">{currentUser.email}</p>
                <span className="badge px-3 py-2" style={{ background: '#4a9eff' }}>Analyst</span>
              </>
            )}
          </div>

          {sidebarOpen && <p className="text-white-50 small mb-4">Batch Management</p>}

          <nav className="nav flex-column">
            {sidebarTabs.map(tab => {
              const isActive = activeTab === tab.key;
              const isHovered = hoveredTab === tab.key;
              const accentColor = isActive ? "#4a9eff" : (isHovered ? tab.color : "white");

              return (
                <button key={tab.key}
                  className={`nav-link border-0 bg-transparent mb-2 py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                  onClick={() => { tab.special ? setShowReportsModal(true) : setActiveTab(tab.key); }}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  title={!sidebarOpen ? tab.label : undefined}
                  style={{
                    ...sidebarStyles.navItem,
                    color: accentColor,
                    ...(isActive && !tab.special ? sidebarStyles.navItemActive : {}),
                    ...(isHovered && !isActive ? {
                      ...sidebarStyles.navItemHover,
                      borderLeftColor: tab.color,
                      background: `linear-gradient(90deg, ${tab.color}22 0%, transparent 100%)`
                    } : {})
                  }}>
                  <i className={`bi ${tab.icon} ${sidebarOpen ? "me-2" : ""}`}
                    style={{
                      fontSize: sidebarOpen ? undefined : "1.2rem",
                      transition: "all 0.25s ease", transform: isHovered ? "scale(1.2)" : "scale(1)",
                      color: accentColor, filter: isHovered && !isActive ? `drop-shadow(0 0 4px ${tab.color}88)` : "none"
                    }}></i>
                  {sidebarOpen && tab.label}
                  {sidebarOpen && tab.badge !== null && (
                    <span className="badge ms-auto" style={{
                      background: tab.special ? '#fd7e14' : (isActive ? '#4a9eff' : (isHovered ? tab.color : '#4a9eff')),
                      transition: 'background 0.3s ease'
                    }}>{tab.badge}</span>
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
                ...(hoveredTab === "logout" ? sidebarStyles.logoutHover : {})
              }}>
              <i className={`bi bi-box-arrow-right ${sidebarOpen ? "me-2" : ""}`}
                style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transition: "all 0.25s ease", transform: hoveredTab === "logout" ? "scale(1.2)" : "scale(1)" }}></i>
              {sidebarOpen && "Logout"}
            </button>
          </nav>
        </div>
      </div>

      {/* ─── Main Content ──────────────────────────────────────── */}
      <div className="flex-grow-1 p-4" style={{
        marginLeft: sidebarOpen ? "280px" : "70px",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold" style={{ color: "#1a1e2b" }}>
            {activeTab === "dashboard" && <><i className="bi bi-speedometer2 me-2" style={{ color: '#4a9eff' }}></i>Analytics Overview</>}
            {activeTab === "create" && <><i className={`bi ${editingBatch ? "bi-pencil-square" : "bi-plus-circle"} me-2`} style={{ color: '#4a9eff' }}></i>{editingBatch ? "Edit Batch" : "Create New Batch"}</>}
            {activeTab === "batches" && <><i className="bi bi-collection me-2" style={{ color: '#4a9eff' }}></i>All Batches</>}
          </h4>
        </div>

        {/* ─── Dashboard Tab ──────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Row 1 */}
            <div className="row g-4 mb-4">
              {[
                { label: "Total Batches", value: stats.totalBatches, icon: "bi-collection-fill", bg: "#4a9eff" },
                { label: "Ongoing", value: stats.ongoingBatches, icon: "bi-play-circle-fill", bg: "#28a745" },
                { label: "Completed", value: stats.completedBatches, icon: "bi-check-circle-fill", bg: "#6c757d" },
                { label: "Upcoming", value: stats.upcomingBatches, icon: "bi-calendar-event-fill", bg: "#fd7e14" }
              ].map((card, i) => (
                <div className="col-md-3" key={i}>
                  <div className="card p-3 border-0 shadow h-100" style={{ background: card.bg, borderRadius: "12px", color: "white" }}>
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

            {/* Stats Row 2 */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card p-3 border-0 shadow h-100" style={{ background: "#EC4899", borderRadius: "12px", color: "white" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Total Students Enrolled</h6>
                      <h3 className="fw-bold mb-0">{stats.totalStudents}</h3>
                    </div>
                    <i className="bi bi-people-fill fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card p-3 border-0 shadow h-100" style={{ background: "#14B8A6", borderRadius: "12px", color: "white" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Overall Occupancy Rate</h6>
                      <h3 className="fw-bold mb-0">{stats.occupancyRate}%</h3>
                    </div>
                    <i className="bi bi-pie-chart-fill fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-4 mb-4">
              {[
                { label: "Create Batch", icon: "bi-plus-circle-fill", bg: "#4a9eff", action: () => { resetForm(); setEditingBatch(null); setActiveTab("create"); } },
                { label: "View Batches", icon: "bi-collection-fill", bg: "#28a745", action: () => setActiveTab("batches") },
                { label: "Reports", icon: "bi-bar-chart-steps", bg: "#8B5CF6", action: () => setShowReportsModal(true) }
              ].map((item, idx) => (
                <div className="col-md-4" key={idx}>
                  <div className="card border-0 shadow h-100" onClick={item.action}
                    style={{ borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.25s ease' }}
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

            {/* Recent Batches */}
            <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div className="card-header bg-white border-0 py-3 px-4">
                <h5 className="fw-bold mb-0"><i className="bi bi-clock-history me-2" style={{ color: '#4a9eff' }}></i>Recent Batches</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th className="py-3 ps-4 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Batch</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Course</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Trainer</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Status</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.slice(0, 5).map(batch => (
                      <tr key={batch.id} className="align-middle">
                        <td className="py-3 ps-4 fw-semibold">{batch.batchName}</td>
                        <td className="py-3">{batch.course}</td>
                        <td className="py-3">{batch.trainer}</td>
                        <td className="py-3">
                          <span className={`badge ${batch.status === "Ongoing" ? "bg-success" : batch.status === "Completed" ? "bg-secondary" : "bg-primary"}`}>{batch.status}</span>
                        </td>
                        <td className="py-3">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewClick(batch)}>
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {batches.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">No batches created yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ─── Create Batch Tab ───────────────────────────────── */}
        {activeTab === "create" && (
          <div className="card border-0 shadow" style={{ borderRadius: '12px' }}>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Batch Name <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-hash"></i></span>
                    <input type="text" className="form-control" placeholder="e.g. BT08"
                      value={newBatch.batchName} onChange={e => setNewBatch({ ...newBatch, batchName: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Course <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-book"></i></span>
                    <input type="text" className="form-control" placeholder="e.g. Python"
                      value={newBatch.course} onChange={e => setNewBatch({ ...newBatch, course: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Trainer <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                    <input type="text" className="form-control" placeholder="Trainer name"
                      value={newBatch.trainer} onChange={e => setNewBatch({ ...newBatch, trainer: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Max Students <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-people"></i></span>
                    <input type="number" className="form-control" placeholder="e.g. 25"
                      value={newBatch.maxStudents} onChange={e => setNewBatch({ ...newBatch, maxStudents: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Start Date <span className="text-danger">*</span></label>
                  <input type="date" className="form-control"
                    value={newBatch.startDate} onChange={e => setNewBatch({ ...newBatch, startDate: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">End Date <span className="text-danger">*</span></label>
                  <input type="date" className="form-control"
                    value={newBatch.endDate} onChange={e => setNewBatch({ ...newBatch, endDate: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Mode</label>
                  <select className="form-select" value={newBatch.mode} onChange={e => setNewBatch({ ...newBatch, mode: e.target.value })}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Status</label>
                  <select className="form-select" value={newBatch.status} onChange={e => setNewBatch({ ...newBatch, status: e.target.value })}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 d-flex gap-2">
                {editingBatch ? (
                  <>
                    <button className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none' }} onClick={handleUpdateBatch}>
                      <i className="bi bi-check-lg me-2"></i>Update Batch
                    </button>
                    <button className="btn btn-light px-4 py-2" onClick={() => { setEditingBatch(null); resetForm(); setActiveTab("dashboard"); }}>Cancel</button>
                  </>
                ) : (
                  <button className="btn text-white w-100 py-3 fw-bold" style={{ background: '#4a9eff', border: 'none', borderRadius: '10px' }} onClick={handleCreateBatch}>
                    <i className="bi bi-plus-lg me-2"></i>Create Batch
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── All Batches Tab ────────────────────────────────── */}
        {activeTab === "batches" && (
          <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#4a9eff' }} role="status"><span className="visually-hidden">Loading...</span></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#1a1e2b", color: "white" }}>
                    <tr>
                      <th className="py-3 ps-4">Batch</th>
                      <th className="py-3">Course</th>
                      <th className="py-3">Trainer</th>
                      <th className="py-3">Students</th>
                      <th className="py-3">Start</th>
                      <th className="py-3">End</th>
                      <th className="py-3">Mode</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map(batch => (
                      <tr key={batch.id} className="align-middle">
                        <td className="py-3 ps-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                              <i className="bi bi-collection-fill" style={{ color: '#4a9eff', fontSize: '0.9rem' }}></i>
                            </div>
                            <span className="fw-semibold">{batch.batchName}</span>
                          </div>
                        </td>
                        <td className="py-3">{batch.course}</td>
                        <td className="py-3">{batch.trainer}</td>
                        <td className="py-3">
                          <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>
                            {batch.studentsEnrolled || 0}/{batch.maxStudents}
                          </span>
                        </td>
                        <td className="py-3"><small>{new Date(batch.startDate).toLocaleDateString()}</small></td>
                        <td className="py-3"><small>{new Date(batch.endDate).toLocaleDateString()}</small></td>
                        <td className="py-3">
                          <span className={`badge ${batch.mode === "Online" ? "bg-success" : batch.mode === "Offline" ? "bg-primary" : "bg-warning"}`}>
                            {batch.mode}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`badge ${batch.status === "Ongoing" ? "bg-success" : batch.status === "Completed" ? "bg-secondary" : "bg-primary"}`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="btn btn-sm btn-info text-white me-1" onClick={() => handleViewClick(batch)} style={{ borderRadius: '8px' }}>
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button className="btn btn-sm btn-warning text-white me-1" onClick={() => handleEditClick(batch)} style={{ borderRadius: '8px' }}>
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-sm btn-danger text-white" onClick={() => handleDeleteClick(batch)} style={{ borderRadius: '8px' }}>
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {batches.length === 0 && (
                      <tr><td colSpan="9" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-3"></i>No batches found. Click "Create Batch" to get started.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewBatchModal show={showViewModal} batch={selectedBatch} onClose={() => setShowViewModal(false)} />
      <DeleteConfirmationModal show={showDeleteModal} item={batchToDelete} onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
      <LogoutConfirmationModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
      <ReportsComingSoonModal show={showReportsModal} onClose={() => setShowReportsModal(false)} />
    </div>
  );
};

export default AnalystDashboard;