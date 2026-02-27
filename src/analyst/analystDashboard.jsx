import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

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

  // Get current user info
  const currentUser = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName") || "Analyst",
    email: localStorage.getItem("userEmail") || "analyst@example.com",
    role: localStorage.getItem("userRole") || "ANALYST"
  };

  // Form state for new batch
  const [newBatch, setNewBatch] = useState({
    batchName: "",
    course: "",
    trainer: "",
    startDate: "",
    endDate: "",
    maxStudents: "",
    mode: "Online",
    status: "Upcoming",
    studentsEnrolled: 0
  });

  const [editingBatch, setEditingBatch] = useState(null);

  // Fetch batches from API
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/batches`);
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Stats calculations
  const stats = {
    totalBatches: batches.length,
    ongoingBatches: batches.filter(b => b.status === "Ongoing").length,
    completedBatches: batches.filter(b => b.status === "Completed").length,
    upcomingBatches: batches.filter(b => b.status === "Upcoming").length,
    totalStudents: batches.reduce((sum, batch) => sum + (parseInt(batch.studentsEnrolled) || 0), 0),
    occupancyRate: batches.length > 0
      ? Math.round((batches.reduce((sum, batch) => sum + (parseInt(batch.studentsEnrolled) || 0), 0) / 
         batches.reduce((sum, batch) => sum + (parseInt(batch.maxStudents) || 0), 0)) * 100)
      : 0
  };

  // Create Batch
  const handleCreateBatch = async () => {
    if (!newBatch.batchName || !newBatch.course || !newBatch.trainer || 
        !newBatch.startDate || !newBatch.endDate || !newBatch.maxStudents) {
      alert("Please fill all required fields");
      return;
    }

    const batchData = {
      ...newBatch,
      id: Date.now().toString(),
      studentsEnrolled: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
      createdById: currentUser.id
    };

    try {
      const response = await axios.post(`${API_URL}/batches`, batchData);
      setBatches([...batches, response.data]);
      resetForm();
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };

  // Edit Batch
  const handleEditClick = (batch) => {
    setEditingBatch(batch);
    setNewBatch(batch);
    setActiveTab("create");
  };

  const handleUpdateBatch = async () => {
    try {
      const response = await axios.put(`${API_URL}/batches/${editingBatch.id}`, newBatch);
      const updatedBatches = batches.map(batch =>
        batch.id === editingBatch.id ? response.data : batch
      );
      setBatches(updatedBatches);
      setEditingBatch(null);
      resetForm();
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Error updating batch:", error);
    }
  };

  // Delete Batch
  const handleDeleteClick = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/batches/${batchToDelete.id}`);
      const filtered = batches.filter(b => b.id !== batchToDelete.id);
      setBatches(filtered);
      setShowDeleteModal(false);
      setBatchToDelete(null);
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  // View Batch Details
  const handleViewClick = (batch) => {
    setSelectedBatch(batch);
    setShowViewModal(true);
  };

  // Reset form
  const resetForm = () => {
    setNewBatch({
      batchName: "",
      course: "",
      trainer: "",
      startDate: "",
      endDate: "",
      maxStudents: "",
      mode: "Online",
      status: "Upcoming",
      studentsEnrolled: 0
    });
  };

  // Logout handlers
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    navigate("/login");
  };

  // Reports modal handler
  const handleReportsClick = () => {
    setShowReportsModal(true);
  };

  // Coming Soon Modal for Reports
  const ReportsComingSoonModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowReportsModal(false)}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="modal-body p-0">
            <div className="text-center p-5">
              {/* Animated Icon */}
              <div className="mb-4 position-relative">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 position-relative">
                  <i className="bi bi-bar-chart-steps text-primary" style={{ fontSize: '4rem' }}></i>
                </div>
                <div className="position-absolute top-0 start-50 translate-middle">
                  <span className="badge bg-warning text-white px-3 py-2 rounded-pill" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-stars me-1"></i>
                    New
                  </span>
                </div>
              </div>

              {/* Title with gradient */}
              <h3 className="fw-bold mb-3" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Reports Coming Soon!
              </h3>

              {/* Description */}
              <p className="text-muted mb-4 px-3">
                We're working hard to bring you powerful analytics and insights. 
                Soon you'll be able to generate detailed reports about your batches, 
                student performance, and much more.
              </p>

              {/* Feature List */}
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
                    <small className="text-muted">PDF/Excel</small>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Development Progress</span>
                  <span className="fw-semibold small text-primary">75%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: '75%' }}
                    aria-valuenow="75" 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>

              {/* Notify Button */}
              <button 
                className="btn btn-primary px-5 py-2 rounded-pill"
                onClick={() => setShowReportsModal(false)}
              >
                <i className="bi bi-bell me-2"></i>
                Notify Me When Ready
              </button>

              {/* Close Button */}
              <button 
                className="btn btn-link text-muted d-block mx-auto mt-3 text-decoration-none"
                onClick={() => setShowReportsModal(false)}
              >
                Maybe Later <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // View Modal Component
  const ViewBatchModal = () => {
    if (!selectedBatch) return null;

    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowViewModal(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-eye me-2"></i>
                Batch Details
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                {/* Batch Header */}
                <div className="col-12 text-center mb-2">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                    <i className="bi bi-collection-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
                  </div>
                  <h4 className="fw-bold mb-1">{selectedBatch.batchName}</h4>
                  <span className={`badge ${
                    selectedBatch.status === "Ongoing" ? "bg-success" :
                    selectedBatch.status === "Completed" ? "bg-secondary" : "bg-primary"
                  } px-3 py-2`}>
                    {selectedBatch.status}
                  </span>
                </div>

                {/* Batch Information */}
                <div className="col-md-6">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-info-circle me-2"></i>Basic Info</h6>
                      <div className="mb-2"><span className="text-muted">Course:</span> {selectedBatch.course}</div>
                      <div className="mb-2"><span className="text-muted">Trainer:</span> {selectedBatch.trainer}</div>
                      <div className="mb-2"><span className="text-muted">Mode:</span> 
                        <span className={`badge ms-2 ${
                          selectedBatch.mode === "Online" ? "bg-success" :
                          selectedBatch.mode === "Offline" ? "bg-primary" : "bg-warning"
                        } bg-opacity-10 text-${
                          selectedBatch.mode === "Online" ? "success" :
                          selectedBatch.mode === "Offline" ? "primary" : "warning"
                        }`}>
                          {selectedBatch.mode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="col-md-6">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-calendar me-2"></i>Schedule</h6>
                      <div className="mb-2"><span className="text-muted">Start Date:</span> {new Date(selectedBatch.startDate).toLocaleDateString()}</div>
                      <div className="mb-2"><span className="text-muted">End Date:</span> {new Date(selectedBatch.endDate).toLocaleDateString()}</div>
                      <div><span className="text-muted">Duration:</span> {
                        Math.ceil((new Date(selectedBatch.endDate) - new Date(selectedBatch.startDate)) / (1000 * 60 * 60 * 24))
                      } days</div>
                    </div>
                  </div>
                </div>

                {/* Capacity Information */}
                <div className="col-12">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-people me-2"></i>Enrollment</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2"><span className="text-muted">Max Students:</span> {selectedBatch.maxStudents}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-2"><span className="text-muted">Enrolled:</span> {selectedBatch.studentsEnrolled || 0}</div>
                        </div>
                        <div className="col-12 mt-2">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted small">Occupancy Rate</span>
                            <span className="fw-semibold small">
                              {Math.round(((selectedBatch.studentsEnrolled || 0) / selectedBatch.maxStudents) * 100)}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: '10px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${((selectedBatch.studentsEnrolled || 0) / selectedBatch.maxStudents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="col-12">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-clock-history me-2"></i>Additional Info</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-2"><span className="text-muted">Created By:</span> {selectedBatch.createdBy || 'N/A'}</div>
                        </div>
                        <div className="col-md-6">
                          <div><span className="text-muted">Created On:</span> {selectedBatch.createdAt ? new Date(selectedBatch.createdAt).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDeleteModal(false)}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Delete Batch</h5>
              <p className="text-muted mb-0">
                Are you sure you want to delete "{batchToDelete?.batchName}"? This action cannot be undone.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light flex-grow-1 py-2" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger flex-grow-1 py-2" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Logout Confirmation Modal
  const LogoutConfirmationModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowLogoutModal(false)}>
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
              <button className="btn btn-light flex-grow-1 py-2" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn btn-warning flex-grow-1 py-2 text-white" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Style for hover effects
  const sidebarStyles = {
    navItem: {
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    },
    navItemHover: {
      transform: "translateX(5px)",
      backgroundColor: "rgba(74, 158, 255, 0.15)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      borderLeft: "4px solid #4a9eff"
    },
    navItemActive: {
      backgroundColor: "rgba(74, 158, 255, 0.25)",
      borderLeft: "4px solid #4a9eff",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
    },
    iconHover: {
      transform: "scale(1.1)",
      transition: "transform 0.2s ease"
    },
    logoutHover: {
      backgroundColor: "rgba(255, 107, 107, 0.15)",
      color: "#ff6b6b",
      transform: "translateX(5px)"
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
      
      {/* Enhanced Sidebar with hover effects */}
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
          
          {/* User Profile Section with hover effect */}
          <div 
            className="text-center mb-4 p-3 rounded"
            style={{ 
              transition: "all 0.3s ease",
              cursor: "default",
              background: hoveredTab === "profile" ? "rgba(255,255,255,0.1)" : "transparent"
            }}
            onMouseEnter={() => setHoveredTab("profile")}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <div 
              className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ 
                width: "80px", 
                height: "80px",
                transition: "all 0.3s ease",
                transform: hoveredTab === "profile" ? "scale(1.05)" : "scale(1)"
              }}
            >
              <i className="bi bi-person-fill text-white" style={{ fontSize: "2.5rem" }}></i>
            </div>
            <h6 className="text-white mb-1">{currentUser.name}</h6>
            <p className="text-white-50 small mb-2">{currentUser.email}</p>
            <span className="badge bg-info px-3 py-2">Analyst</span>
          </div>

          <p className="text-white-50 small mb-4">Batch Management</p>

          <nav className="nav flex-column">
            {/* Dashboard Tab */}
            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded`}
              onClick={() => setActiveTab("dashboard")}
              onMouseEnter={() => setHoveredTab("dashboard")}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...sidebarStyles.navItem,
                ...(activeTab === "dashboard" ? sidebarStyles.navItemActive : {}),
                ...(hoveredTab === "dashboard" && activeTab !== "dashboard" ? sidebarStyles.navItemHover : {})
              }}
            >
              <i 
                className="bi bi-speedometer2 me-2" 
                style={{ 
                  transition: "transform 0.2s ease",
                  transform: hoveredTab === "dashboard" ? "scale(1.1)" : "scale(1)"
                }}
              ></i>
              Dashboard
              {hoveredTab === "dashboard" && (
                <span className="position-absolute end-0 me-3" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>

            {/* Create Batch Tab */}
            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded`}
              onClick={() => {
                resetForm();
                setEditingBatch(null);
                setActiveTab("create");
              }}
              onMouseEnter={() => setHoveredTab("create")}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...sidebarStyles.navItem,
                ...(activeTab === "create" ? sidebarStyles.navItemActive : {}),
                ...(hoveredTab === "create" && activeTab !== "create" ? sidebarStyles.navItemHover : {})
              }}
            >
              <i 
                className="bi bi-plus-circle me-2" 
                style={{ 
                  transition: "transform 0.2s ease",
                  transform: hoveredTab === "create" ? "scale(1.1)" : "scale(1)"
                }}
              ></i>
              Create Batch
              {hoveredTab === "create" && (
                <span className="position-absolute end-0 me-3" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>

            {/* All Batches Tab */}
            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded`}
              onClick={() => setActiveTab("batches")}
              onMouseEnter={() => setHoveredTab("batches")}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...sidebarStyles.navItem,
                ...(activeTab === "batches" ? sidebarStyles.navItemActive : {}),
                ...(hoveredTab === "batches" && activeTab !== "batches" ? sidebarStyles.navItemHover : {})
              }}
            >
              <i 
                className="bi bi-collection me-2" 
                style={{ 
                  transition: "transform 0.2s ease",
                  transform: hoveredTab === "batches" ? "scale(1.1)" : "scale(1)"
                }}
              ></i>
              All Batches
              {hoveredTab === "batches" && (
                <span className="position-absolute end-0 me-3" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>

            {/* Reports Section with enhanced hover */}
            <button 
              className="nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded position-relative"
              onClick={handleReportsClick}
              onMouseEnter={() => setHoveredTab("reports")}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...sidebarStyles.navItem,
                background: hoveredTab === "reports" 
                  ? "linear-gradient(90deg, rgba(74,158,255,0.2) 0%, rgba(74,158,255,0.1) 100%)"
                  : "linear-gradient(90deg, rgba(74,158,255,0.1) 0%, rgba(74,158,255,0) 100%)",
                borderLeft: hoveredTab === "reports" ? "4px solid #4a9eff" : "3px solid #4a9eff",
                transform: hoveredTab === "reports" ? "translateX(5px)" : "translateX(0)"
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <i 
                    className="bi bi-bar-chart-steps me-2" 
                    style={{ 
                      color: "#4a9eff",
                      transition: "transform 0.2s ease",
                      transform: hoveredTab === "reports" ? "scale(1.1)" : "scale(1)"
                    }}
                  ></i>
                  Reports
                </div>
                <span 
                  className="badge bg-warning text-dark rounded-pill" 
                  style={{ 
                    fontSize: '0.7rem',
                    transition: "all 0.2s ease",
                    transform: hoveredTab === "reports" ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  <i className="bi bi-stars me-1"></i>
                  Soon
                </span>
              </div>
              {hoveredTab === "reports" && (
                <span className="position-absolute end-0 me-3" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>

            <hr className="my-4 bg-white-50" />
            
            {/* Logout button with red hover effect */}
            <button 
              className="nav-link text-white text-start w-100 border-0 bg-transparent py-2 px-3 rounded"
              onClick={handleLogoutClick}
              onMouseEnter={() => setHoveredTab("logout")}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...sidebarStyles.navItem,
                color: hoveredTab === "logout" ? "#ff6b6b" : "white",
                ...(hoveredTab === "logout" ? sidebarStyles.logoutHover : {})
              }}
            >
              <i 
                className="bi bi-box-arrow-right me-2" 
                style={{ 
                  transition: "transform 0.2s ease",
                  transform: hoveredTab === "logout" ? "scale(1.1)" : "scale(1)"
                }}
              ></i>
              Logout
              {hoveredTab === "logout" && (
                <span className="position-absolute end-0 me-3">
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ marginLeft: "280px" }}>
        
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h4 className="fw-bold mb-4" style={{ color: "#0d1b2a" }}>Analytics Overview</h4>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Cards - Now with 6 cards (removed 2) */}
                <div className="row g-4 mb-4">
                  {/* Total Batches - Purple theme */}
                  <div className="col-md-4">
                    <div 
                      className="card p-3 border-0 shadow-lg h-100"
                      style={{ 
                        background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                        borderRadius: "15px",
                        color: "white"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Total Batches</h6>
                          <h3 className="fw-bold mb-0">{stats.totalBatches}</h3>
                        </div>
                        <i className="bi bi-collection-fill fs-1 text-white-50"></i>
                      </div>
                    </div>
                  </div>

                  {/* Ongoing Batches - Blue theme */}
                  <div className="col-md-4">
                    <div 
                      className="card p-3 border-0 shadow-lg h-100"
                      style={{ 
                        background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                        borderRadius: "15px",
                        color: "white"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Ongoing Batches</h6>
                          <h3 className="fw-bold mb-0">{stats.ongoingBatches}</h3>
                        </div>
                        <i className="bi bi-play-circle-fill fs-1 text-white-50"></i>
                      </div>
                    </div>
                  </div>
                  
                  {/* Completed Batches - Green theme */}
                  <div className="col-md-4">
                    <div 
                      className="card p-3 border-0 shadow-lg h-100"
                      style={{ 
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        borderRadius: "15px",
                        color: "white"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Completed Batches</h6>
                          <h3 className="fw-bold mb-0">{stats.completedBatches}</h3>
                        </div>
                        <i className="bi bi-check-circle-fill fs-1 text-white-50"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row Stats - Now 3 cards */}
                <div className="row g-4 mb-4">
                  {/* Upcoming Batches - Orange theme */}
                  <div className="col-md-4">
                    <div 
                      className="card p-3 border-0 shadow-lg h-100"
                      style={{ 
                        background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
                        borderRadius: "15px",
                        color: "white"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Upcoming Batches</h6>
                          <h3 className="fw-bold mb-0">{stats.upcomingBatches}</h3>
                        </div>
                        <i className="bi bi-calendar-event-fill fs-1 text-white-50"></i>
                      </div>
                    </div>
                  </div>

                  {/* Total Students - Pink theme */}
                  <div className="col-md-4">
                    <div 
                      className="card p-3 border-0 shadow-lg h-100"
                      style={{ 
                        background: "linear-gradient(135deg, #EC4899 0%, #DB2777 100%)",
                        borderRadius: "15px",
                        color: "white"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Total Students</h6>
                          <h3 className="fw-bold mb-0">{stats.totalStudents}</h3>
                        </div>
                        <i className="bi bi-people-fill fs-1 text-white-50"></i>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy Rate - Teal theme */}
                  <div className="col-md-4">
                    <div 
                      className="card p-3 border-0 shadow-lg h-100"
                      style={{ 
                        background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                        borderRadius: "15px",
                        color: "white"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-white-50 mb-2">Occupancy Rate</h6>
                          <h3 className="fw-bold mb-0">{stats.occupancyRate}%</h3>
                        </div>
                        <i className="bi bi-pie-chart-fill fs-1 text-white-50"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Batches Table */}
                <div className="card border-0 shadow-sm mt-4">
                  <div className="card-header bg-white border-0 py-3">
                    <h6 className="fw-bold mb-0">Recent Batches</h6>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="py-3 ps-4">Batch Name</th>
                            <th className="py-3">Course</th>
                            <th className="py-3">Trainer</th>
                            <th className="py-3">Start Date</th>
                            <th className="py-3">Status</th>
                            <th className="py-3">Mode</th>
                            <th className="py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {batches.slice(0, 5).map((batch) => (
                            <tr key={batch.id}>
                              <td className="py-3 ps-4 fw-semibold">{batch.batchName}</td>
                              <td className="py-3">{batch.course}</td>
                              <td className="py-3">{batch.trainer}</td>
                              <td className="py-3">{new Date(batch.startDate).toLocaleDateString()}</td>
                              <td className="py-3">
                                <span className={`badge ${
                                  batch.status === "Ongoing" ? "bg-success" :
                                  batch.status === "Completed" ? "bg-secondary" : "bg-primary"
                                }`}>
                                  {batch.status}
                                </span>
                              </td>
                              <td className="py-3">
                                <span className={`badge ${
                                  batch.mode === "Online" ? "bg-success" :
                                  batch.mode === "Offline" ? "bg-primary" : "bg-warning"
                                } bg-opacity-10 text-${
                                  batch.mode === "Online" ? "success" :
                                  batch.mode === "Offline" ? "primary" : "warning"
                                }`}>
                                  {batch.mode}
                                </span>
                              </td>
                              <td className="py-3">
                                <button 
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => handleViewClick(batch)}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                          {batches.length === 0 && (
                            <tr>
                              <td colSpan="7" className="text-center py-4 text-muted">
                                No batches created yet
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Create Batch Tab */}
        {activeTab === "create" && (
          <div>
            <h4 className="fw-bold mb-4" style={{ color: "#0d1b2a" }}>
              <i className={`bi ${editingBatch ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
              {editingBatch ? "Edit Batch" : "Create New Batch"}
            </h4>

            {/* Enhanced Form - Matching AdminDashboard style */}
            <div className="card border-0 shadow-lg" style={{ borderRadius: "15px" }}>
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Basic Information */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Batch Name"
                        value={newBatch.batchName}
                        onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Batch Name *</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Course Name"
                        value={newBatch.course}
                        onChange={(e) => setNewBatch({ ...newBatch, course: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Course Name *</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        placeholder="Trainer Name"
                        value={newBatch.trainer}
                        onChange={(e) => setNewBatch({ ...newBatch, trainer: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Trainer Name *</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        type="number"
                        placeholder="Max Students"
                        value={newBatch.maxStudents}
                        onChange={(e) => setNewBatch({ ...newBatch, maxStudents: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Max Students *</label>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        type="date"
                        value={newBatch.startDate}
                        onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>Start Date *</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control border-0 bg-light"
                        type="date"
                        value={newBatch.endDate}
                        onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
                        style={{ borderRadius: "10px" }}
                        required
                      />
                      <label>End Date *</label>
                    </div>
                  </div>

                  {/* Select Fields */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select 
                        className="form-control border-0 bg-light"
                        value={newBatch.mode}
                        onChange={(e) => setNewBatch({ ...newBatch, mode: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <label>Batch Mode</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <select 
                        className="form-control border-0 bg-light"
                        value={newBatch.status}
                        onChange={(e) => setNewBatch({ ...newBatch, status: e.target.value })}
                        style={{ borderRadius: "10px" }}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <label>Status</label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 mt-4">
                    {editingBatch ? (
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-success px-4 py-2 fw-bold"
                          onClick={handleUpdateBatch}
                          style={{ borderRadius: "10px" }}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Update Batch
                        </button>
                        <button 
                          className="btn btn-secondary px-4 py-2 fw-bold"
                          onClick={() => {
                            setEditingBatch(null);
                            resetForm();
                            setActiveTab("dashboard");
                          }}
                          style={{ borderRadius: "10px" }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn w-100 py-3 fw-bold text-white"
                        onClick={handleCreateBatch}
                        style={{ 
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none"
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Batch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Batches Tab */}
        {activeTab === "batches" && (
          <div>
            <h4 className="fw-bold mb-4" style={{ color: "#0d1b2a" }}>
              <i className="bi bi-collection me-2"></i>
              All Batches
            </h4>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              /* Enhanced Table - Matching AdminDashboard style */
              <div className="card border-0 shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: "#0d1b2a", color: "white" }}>
                      <tr>
                        <th className="py-3 ps-4">Batch Name</th>
                        <th className="py-3">Course</th>
                        <th className="py-3">Trainer</th>
                        <th className="py-3">Students</th>
                        <th className="py-3">Start Date</th>
                        <th className="py-3">End Date</th>
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
                              <div 
                                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                                style={{ width: "35px", height: "35px" }}
                              >
                                <i className="bi bi-collection-fill text-primary"></i>
                              </div>
                              {batch.batchName}
                            </div>
                          </td>
                          <td className="py-3">{batch.course}</td>
                          <td className="py-3">{batch.trainer}</td>
                          <td className="py-3">
                            <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                              {batch.studentsEnrolled || 0}/{batch.maxStudents}
                            </span>
                          </td>
                          <td className="py-3">{new Date(batch.startDate).toLocaleDateString()}</td>
                          <td className="py-3">{new Date(batch.endDate).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={`badge ${
                              batch.mode === "Online" ? "bg-success" :
                              batch.mode === "Offline" ? "bg-primary" : "bg-warning"
                            } bg-opacity-10 text-${
                              batch.mode === "Online" ? "success" :
                              batch.mode === "Offline" ? "primary" : "warning"
                            } px-3 py-2`}>
                              {batch.mode}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`badge ${
                              batch.status === "Ongoing" ? "bg-success" :
                              batch.status === "Completed" ? "bg-secondary" : "bg-primary"
                            } px-3 py-2`}>
                              {batch.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <button 
                              className="btn btn-sm btn-info text-white me-2"
                              onClick={() => handleViewClick(batch)}
                              style={{ borderRadius: "8px" }}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-warning text-white me-2"
                              onClick={() => handleEditClick(batch)}
                              style={{ borderRadius: "8px" }}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger text-white"
                              onClick={() => handleDeleteClick(batch)}
                              style={{ borderRadius: "8px" }}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {batches.length === 0 && (
                        <tr>
                          <td colSpan="9" className="text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                            No batches found. Click "Create Batch" to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showViewModal && <ViewBatchModal />}
      {showDeleteModal && <DeleteConfirmationModal />}
      {showLogoutModal && <LogoutConfirmationModal />}
      {showReportsModal && <ReportsComingSoonModal />}
    </div>
  );
};

export default AnalystDashboard;