// counsellorDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

// ─── Custom Toast Notification Component ─────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '380px'
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };
  const colors = {
    success: { bg: '#d1e7dd', border: '#28a745', text: '#0f5132', icon: '#28a745' },
    error: { bg: '#f8d7da', border: '#dc3545', text: '#842029', icon: '#dc3545' },
    warning: { bg: '#fff3cd', border: '#ffc107', text: '#664d03', icon: '#ffc107' },
    info: { bg: '#cff4fc', border: '#0dcaf0', text: '#055160', icon: '#0dcaf0' }
  };
  const c = colors[toast.type] || colors.info;

  return (
    <div style={{
      background: c.bg, borderLeft: `4px solid ${c.border}`, borderRadius: '10px',
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)', color: c.text,
      animation: exiting ? 'toastSlideOut 0.3s ease forwards' : 'toastSlideIn 0.35s ease',
      minWidth: '300px'
    }}>
      <i className={`bi ${icons[toast.type]}`} style={{ fontSize: '1.3rem', color: c.icon }}></i>
      <span style={{ flex: 1, fontWeight: 500, fontSize: '0.92rem' }}>{toast.message}</span>
      <button onClick={() => { setExiting(true); setTimeout(onClose, 300); }}
        style={{ background: 'none', border: 'none', color: c.text, cursor: 'pointer', fontSize: '1.1rem', padding: 0, opacity: 0.6 }}>
        <i className="bi bi-x-lg"></i>
      </button>
      <style>{`
        @keyframes toastSlideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
      `}</style>
    </div>
  );
}

// ─── Add Student Modal ───────────────────────────────────────────────
function AddStudentModal({ show, onClose, newStudent, setNewStudent, editingStudent, onSave, onCancel }) {
  if (!show) return null;
  const handleSubmit = (e) => { e.preventDefault(); onSave(); };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className={`bi ${editingStudent ? 'bi-pencil-square' : 'bi-person-plus'} me-2`} style={{ color: '#4a9eff' }}></i>
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                    <input type="text" className="form-control" placeholder="Enter full name"
                      value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                    <input type="email" className="form-control" placeholder="Enter email"
                      value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-telephone"></i></span>
                    <input type="text" className="form-control" placeholder="Enter phone number"
                      value={newStudent.phone} onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Course <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-book"></i></span>
                    <input type="text" className="form-control" placeholder="Enter course"
                      value={newStudent.course} onChange={e => setNewStudent({ ...newStudent, course: e.target.value })} required />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Status</label>
                  <select className="form-select"
                    value={newStudent.status} onChange={e => setNewStudent({ ...newStudent, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Enrollment Date</label>
                  <input type="date" className="form-control"
                    value={newStudent.enrollmentDate} onChange={e => setNewStudent({ ...newStudent, enrollmentDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light px-4 py-2" onClick={onCancel}>Cancel</button>
              <button type="submit" className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none' }}>
                <i className={`bi ${editingStudent ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── View Student Modal ──────────────────────────────────────────────
function ViewStudentModal({ show, onClose, student }) {
  if (!show || !student) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-person-lines-fill me-2" style={{ color: '#4a9eff' }}></i>
              Student Details
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="text-center mb-4">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '80px', height: '80px', background: '#e6f0ff' }}>
                <i className="bi bi-person-fill" style={{ fontSize: '2.5rem', color: '#4a9eff' }}></i>
              </div>
              <h5 className="fw-bold mb-1">{student.name}</h5>
              <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"}`}>
                {student.status}
              </span>
            </div>
            <div className="list-group list-group-flush">
              <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                <span className="text-muted"><i className="bi bi-envelope me-2"></i>Email</span>
                <span className="fw-semibold">{student.email || 'N/A'}</span>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                <span className="text-muted"><i className="bi bi-telephone me-2"></i>Phone</span>
                <span className="fw-semibold">{student.phone || 'N/A'}</span>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                <span className="text-muted"><i className="bi bi-book me-2"></i>Course</span>
                <span className="fw-semibold">{student.course || 'N/A'}</span>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                <span className="text-muted"><i className="bi bi-collection me-2"></i>Batch</span>
                <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>
                  {student.batch || 'Not Assigned'}
                </span>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                <span className="text-muted"><i className="bi bi-calendar me-2"></i>Enrollment Date</span>
                <span className="fw-semibold">
                  {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light w-100 py-2" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────
function DeleteConfirmationModal({ show, onClose, onConfirm, studentName }) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="rounded-circle d-inline-flex p-3 mb-3" style={{ background: '#ffe6e6' }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2.5rem', color: '#dc3545' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Delete Student</h5>
              <p className="text-muted mb-0">
                Are you sure you want to delete &quot;{studentName}&quot;? This action cannot be undone.
              </p>
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

// ─── Logout Confirmation Modal ───────────────────────────────────────
function LogoutConfirmationModal({ show, onClose, onConfirm }) {
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-body text-center p-4">
            <div className="mb-4">
              <div className="rounded-circle d-inline-flex p-3 mb-3" style={{ background: '#fff3cd' }}>
                <i className="bi bi-box-arrow-right" style={{ fontSize: '2.5rem', color: '#ffc107' }}></i>
              </div>
              <h5 className="fw-bold mb-2">Confirm Logout</h5>
              <p className="text-muted mb-0">Are you sure you want to logout from your account?</p>
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

// ─── View Batch Students Modal ───────────────────────────────────────
const ViewBatchStudentsModal = ({ show, onClose, batch, students }) => {
  if (!show || !batch) return null;
  const enrolledStudents = students.filter(s => s.batch === batch.batchName);

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-people-fill me-2" style={{ color: '#4a9eff' }}></i>
              Students in {batch.batchName}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-0">
            {/* Batch Summary */}
            <div className="p-4 border-bottom" style={{ background: '#f8f9fa' }}>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px', background: '#e6f0ff', flexShrink: 0 }}>
                      <i className="bi bi-book" style={{ color: '#4a9eff' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Course</small>
                      <span className="fw-semibold">{batch.course}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px', background: '#e8f5e9', flexShrink: 0 }}>
                      <i className="bi bi-person" style={{ color: '#28a745' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Trainer</small>
                      <span className="fw-semibold">{batch.trainer}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px', background: '#fff3e0', flexShrink: 0 }}>
                      <i className="bi bi-people-fill" style={{ color: '#fd7e14' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">Enrolled</small>
                      <span className="fw-semibold">{enrolledStudents.length} / {batch.maxStudents}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
            {enrolledStudents.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th className="py-3 ps-4 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>#</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Student Name</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Email</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Phone</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Course</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Enrollment Date</th>
                      <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledStudents.map((student, idx) => (
                      <tr key={student.id} className="align-middle">
                        <td className="py-3 ps-4 text-muted">{idx + 1}</td>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{ width: '32px', height: '32px', background: '#e6f0ff', flexShrink: 0 }}>
                              <i className="bi bi-person-fill" style={{ color: '#4a9eff', fontSize: '0.85rem' }}></i>
                            </div>
                            <span className="fw-semibold">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-3">{student.email}</td>
                        <td className="py-3">{student.phone}</td>
                        <td className="py-3">{student.course}</td>
                        <td className="py-3">{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : '-'}</td>
                        <td className="py-3">
                          <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-secondary"}`}>{student.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '70px', height: '70px', background: '#f8f9fa' }}>
                  <i className="bi bi-people" style={{ fontSize: '2rem', color: '#adb5bd' }}></i>
                </div>
                <h6 className="fw-bold text-muted mb-1">No Students Enrolled</h6>
                <p className="text-muted small mb-0">No students have been assigned to this batch yet.</p>
              </div>
            )}
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light px-4 py-2" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Assign Batch Modal ──────────────────────────────────────────────
function AssignBatchModal({ show, onClose, students, batches, onAssign }) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");

  if (!show) return null;

  const handleAssign = () => {
    if (!selectedStudentId || !selectedBatchId) {
      return;
    }
    const batch = batches.find(b => b.id === selectedBatchId);
    if (batch) {
      onAssign(selectedStudentId, batch.batchName, batch.course, batch);
      setSelectedStudentId("");
      setSelectedBatchId("");
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
          <div className="modal-header border-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-arrow-repeat me-2" style={{ color: '#4a9eff' }}></i>
              Assign Batch to Student
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Student <span className="text-danger">*</span></label>
              <select className="form-select" value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}>
                <option value="">-- Choose a student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Batch <span className="text-danger">*</span></label>
              <select className="form-select" value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}>
                <option value="">-- Choose a batch --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchName} - {b.course} ({b.mode}, {b.status})
                  </option>
                ))}
              </select>
            </div>
            {selectedBatchId && (() => {
              const batch = batches.find(b => b.id === selectedBatchId);
              return batch ? (
                <div className="alert alert-info py-2 mb-0">
                  <small>
                    <strong>{batch.batchName}</strong> — {batch.course} | Trainer: {batch.trainer} |
                    Mode: {batch.mode} | Status: {batch.status} |
                    Enrolled: {batch.studentsEnrolled || 0}/{batch.maxStudents}
                  </small>
                </div>
              ) : null;
            })()}
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light px-4 py-2" onClick={onClose}>Cancel</button>
            <button className="btn text-white px-4 py-2" style={{ background: '#1a1e2b', border: 'none' }}
              onClick={handleAssign} disabled={!selectedStudentId || !selectedBatchId}>
              <i className="bi bi-check-lg me-2"></i>Assign Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════
// ─── Main CounsellorDashboard Component ─────────────────────────────
// ═════════════════════════════════════════════════════════════════════
const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAssignBatchModal, setShowAssignBatchModal] = useState(false);
  const [showBatchStudentsModal, setShowBatchStudentsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toasts, setToasts] = useState([]);
  const [historySearch, setHistorySearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get current user info
  const currentUser = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName") || "Counsellor",
    email: localStorage.getItem("userEmail") || "counsellor@example.com",
    role: localStorage.getItem("role") || "COUNSELOR"
  };

  // Form state for new student
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    batch: "",
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: "Active"
  });

  const [editingStudent, setEditingStudent] = useState(null);

  // ─── Toast helper ────────────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Fetch batches from API ──────────────────────────────────────
  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/batches`);
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setBatches([]);
    }
  };

  // ─── Fetch students from API ─────────────────────────────────────
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  // ─── Stats calculations ──────────────────────────────────────────
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "Active").length,
    inactiveStudents: students.filter(s => s.status === "Inactive").length,
    totalBatches: batches.length,
    ongoingBatches: batches.filter(b => b.status === "Ongoing").length
  };

  // ─── Filter students based on search ─────────────────────────────
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Add Student (POST to API) ───────────────────────────────────
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.course) {
      showToast("Please fill all required fields (Name, Email, Course)", "warning");
      return;
    }

    const studentData = {
      ...newStudent,
      id: Date.now().toString(),
      enrollmentDate: newStudent.enrollmentDate || new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post(`${API_URL}/students`, studentData);
      setStudents([...students, response.data]);
      resetForm();
      setShowAddStudentModal(false);
      showToast("Student added successfully!", "success");
    } catch (error) {
      console.error("Error adding student:", error);
      showToast("Failed to add student. Please check if the server is running.", "error");
    }
  };

  // ─── Edit Student ────────────────────────────────────────────────
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setNewStudent({ ...student });
    setShowAddStudentModal(true);
  };

  // ─── Update Student (PUT to API) ─────────────────────────────────
  const handleUpdateStudent = async () => {
    try {
      const response = await axios.put(`${API_URL}/students/${editingStudent.id}`, newStudent);
      const updatedStudents = students.map(student =>
        student.id === editingStudent.id ? response.data : student
      );
      setStudents(updatedStudents);
      setEditingStudent(null);
      resetForm();
      setShowAddStudentModal(false);
      showToast("Student updated successfully!", "success");
    } catch (error) {
      console.error("Error updating student:", error);
      showToast("Failed to update student. Please check if the server is running.", "error");
    }
  };

  // ─── Delete Student ──────────────────────────────────────────────
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/students/${studentToDelete.id}`);
      const filtered = students.filter(s => s.id !== studentToDelete.id);
      setStudents(filtered);
      setShowDeleteModal(false);
      setStudentToDelete(null);
      showToast("Student deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting student:", error);
      showToast("Failed to delete student. Please check if the server is running.", "error");
    }
  };

  // ─── View Student Details ────────────────────────────────────────
  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // ─── Assign Batch (PUT student + update batch studentsEnrolled) ──
  const handleAssignBatch = async (studentId, batchName, course, batch) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      // 1. Update student with new batch & course
      const updatedStudent = { ...student, batch: batchName, course };
      const studentRes = await axios.put(`${API_URL}/students/${studentId}`, updatedStudent);

      // 2. Update batch studentsEnrolled count
      const currentEnrolled = parseInt(batch.studentsEnrolled) || 0;
      const updatedBatch = { ...batch, studentsEnrolled: currentEnrolled + 1 };
      const batchRes = await axios.put(`${API_URL}/batches/${batch.id}`, updatedBatch);

      // 3. Update local state for both students and batches
      setStudents(prev => prev.map(s => s.id === studentId ? studentRes.data : s));
      setBatches(prev => prev.map(b => b.id === batch.id ? batchRes.data : b));

      setShowAssignBatchModal(false);
      setSelectedStudent(null);
      showToast(`Batch "${batchName}" assigned to ${student.name} successfully!`, "success");
    } catch (error) {
      console.error("Error assigning batch:", error);
      showToast("Failed to assign batch. Please check if the server is running.", "error");
    }
  };

  // ─── Reset form ──────────────────────────────────────────────────
  const resetForm = () => {
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      course: "",
      batch: "",
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: "Active"
    });
  };

  // ─── Modal handlers ──────────────────────────────────────────────
  const handleCloseAddModal = () => {
    setShowAddStudentModal(false);
    setEditingStudent(null);
    resetForm();
  };

  const handleSaveAddModal = () => {
    if (editingStudent) {
      handleUpdateStudent();
    } else {
      handleAddStudent();
    }
  };

  const handleCancelAddModal = () => {
    setEditingStudent(null);
    resetForm();
    setShowAddStudentModal(false);
  };

  // ─── Logout handlers ────────────────────────────────────────────
  const handleLogoutClick = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    navigate("/login");
  };

  // ─── Sidebar styles ─────────────────────────────────────────────
  const sidebarStyles = {
    navItem: {
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    },
    navItemHover: {
      transform: "translateX(5px)",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      borderLeft: "4px solid #4a9eff"
    },
    navItemActive: {
      background: "linear-gradient(90deg, rgba(74,158,255,0.25) 0%, rgba(74,158,255,0.08) 100%)",
      borderLeft: "4px solid #4a9eff",
      boxShadow: "0 4px 15px rgba(74,158,255,0.15)",
      color: "#4a9eff"
    },
    logoutHover: {
      background: "linear-gradient(90deg, rgba(255,107,107,0.18) 0%, rgba(255,107,107,0.05) 100%)",
      color: "#ff6b6b",
      transform: "translateX(5px)",
      borderLeft: "4px solid #ff6b6b"
    }
  };

  // Sidebar tab config with unique hover colors
  const sidebarTabs = [
    { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2", badge: null, color: "#4a9eff" },
    { key: "students", label: "Students", icon: "bi-people", badge: students.length, color: "#28a745" },
    { key: "batches", label: "Batches", icon: "bi-collection", badge: batches.length, color: "#fd7e14" }
  ];

  // ═══════════════════════════════════════════════════════════════════
  // ─── RENDER ────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f5f7fa" }}>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Sidebar hover keyframes */}
      <style>{`
        .sidebar-tab { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .sidebar-tab:hover { transform: translateX(4px); }
      `}</style>

      {/* ─── Sidebar ──────────────────────────────────────────────── */}
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

          {/* User Profile */}
          <div className={`${sidebarOpen ? "text-center" : "d-flex justify-content-center"} mb-4 p-2 rounded`}
            style={{ transition: "all 0.3s ease", cursor: "default", background: hoveredTab === "profile" ? "rgba(255,255,255,0.05)" : "transparent" }}
            onMouseEnter={() => setHoveredTab("profile")}
            onMouseLeave={() => setHoveredTab(null)}
            title={!sidebarOpen ? `${currentUser.name} (Counsellor)` : undefined}>
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
                <span className="badge px-3 py-2" style={{ background: '#4a9eff' }}>Counsellor</span>
              </>
            )}
          </div>

          {sidebarOpen && <p className="text-white-50 small mb-4">Student Management</p>}

          <nav className="nav flex-column">
            {sidebarTabs.map(tab => {
              const isActive = activeTab === tab.key;
              const isHovered = hoveredTab === tab.key;
              const accentColor = isActive ? "#4a9eff" : (isHovered ? tab.color : "white");

              return (
                <button key={tab.key}
                  className={`nav-link border-0 bg-transparent mb-2 py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                  onClick={() => { setActiveTab(tab.key); }}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  title={!sidebarOpen ? tab.label : undefined}
                  style={{
                    ...sidebarStyles.navItem,
                    color: accentColor,
                    ...(isActive ? sidebarStyles.navItemActive : {}),
                    ...(isHovered && !isActive ? {
                      ...sidebarStyles.navItemHover,
                      borderLeftColor: tab.color,
                      background: `linear-gradient(90deg, ${tab.color}22 0%, transparent 100%)`
                    } : {})
                  }}>
                  <i className={`bi ${tab.icon} ${sidebarOpen ? "me-2" : ""}`}
                    style={{
                      fontSize: sidebarOpen ? undefined : "1.2rem",
                      transition: "all 0.25s ease",
                      transform: isHovered ? "scale(1.2)" : "scale(1)",
                      color: accentColor,
                      filter: isHovered && !isActive ? `drop-shadow(0 0 4px ${tab.color}88)` : "none"
                    }}></i>
                  {sidebarOpen && tab.label}
                  {sidebarOpen && tab.badge !== null && (
                    <span className="badge ms-auto" style={{ background: isActive ? '#4a9eff' : (isHovered ? tab.color : '#4a9eff'), transition: 'background 0.3s ease' }}>{tab.badge}</span>
                  )}
                </button>
              );
            })}

            <hr className="my-3" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Logout */}
            <button className={`nav-link border-0 bg-transparent py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
              onClick={handleLogoutClick}
              onMouseEnter={() => setHoveredTab("logout")}
              onMouseLeave={() => setHoveredTab(null)}
              title={!sidebarOpen ? "Logout" : undefined}
              style={{
                ...sidebarStyles.navItem,
                color: hoveredTab === "logout" ? "#ff6b6b" : "white",
                ...(hoveredTab === "logout" ? sidebarStyles.logoutHover : {})
              }}>
              <i className={`bi bi-box-arrow-right ${sidebarOpen ? "me-2" : ""}`}
                style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transition: "all 0.25s ease", transform: hoveredTab === "logout" ? "scale(1.1)" : "scale(1)" }}></i>
              {sidebarOpen && "Logout"}
            </button>
          </nav>
        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <div className="flex-grow-1 p-4" style={{
        marginLeft: sidebarOpen ? "280px" : "70px",
        transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold" style={{ color: "#1a1e2b" }}>
            {activeTab === "dashboard" && (
              <><i className="bi bi-speedometer2 me-2" style={{ color: '#4a9eff' }}></i>Dashboard</>
            )}
            {activeTab === "students" && (
              <><i className="bi bi-people me-2" style={{ color: '#4a9eff' }}></i>Student Management</>
            )}
            {activeTab === "batches" && (
              <><i className="bi bi-collection me-2" style={{ color: '#4a9eff' }}></i>Batch Management</>
            )}
          </h4>
          {activeTab === "students" && (
            <div className="d-flex gap-2">
              <div className="input-group" style={{ width: "300px" }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search" style={{ color: '#4a9eff' }}></i>
                </span>
                <input type="text" className="form-control border-start-0"
                  placeholder="Search students..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button className="btn d-flex align-items-center text-white"
                style={{ background: '#4a9eff', border: 'none' }}
                onClick={() => { setEditingStudent(null); resetForm(); setShowAddStudentModal(true); }}>
                <i className="bi bi-person-plus me-2"></i>Add Student
              </button>
              <button className="btn d-flex align-items-center"
                style={{ background: '#1a1e2b', color: 'white', border: 'none' }}
                onClick={() => setShowAssignBatchModal(true)}>
                <i className="bi bi-arrow-repeat me-2"></i>Assign Batch
              </button>
            </div>
          )}
        </div>

        {/* ─── Dashboard Tab ───────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow h-100" style={{ background: "#4a9eff", borderRadius: "12px", color: "white" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Total Students</h6>
                      <h3 className="fw-bold mb-0">{stats.totalStudents}</h3>
                    </div>
                    <i className="bi bi-people-fill fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow h-100" style={{ background: "#28a745", borderRadius: "12px", color: "white" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Active Students</h6>
                      <h3 className="fw-bold mb-0">{stats.activeStudents}</h3>
                    </div>
                    <i className="bi bi-check-circle-fill fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow h-100" style={{ background: "#dc3545", borderRadius: "12px", color: "white" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Inactive Students</h6>
                      <h3 className="fw-bold mb-0">{stats.inactiveStudents}</h3>
                    </div>
                    <i className="bi bi-person-x-fill fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow h-100" style={{ background: "#fd7e14", borderRadius: "12px", color: "white" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Total Batches</h6>
                      <h3 className="fw-bold mb-0">{stats.totalBatches}</h3>
                    </div>
                    <i className="bi bi-collection-fill fs-1 text-white-50"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions — horizontal cards in one row */}
            <div className="row g-4 mb-4">
              {[
                {
                  label: "Add New Student", icon: "bi-person-plus-fill", bg: "#4a9eff",
                  action: () => { setActiveTab("students"); setEditingStudent(null); resetForm(); setShowAddStudentModal(true); }
                },
                {
                  label: "Assign Batch", icon: "bi-arrow-repeat", bg: "#1a1e2b",
                  action: () => { setActiveTab("students"); setShowAssignBatchModal(true); }
                },
                {
                  label: "View Students", icon: "bi-people-fill", bg: "#28a745",
                  action: () => setActiveTab("students")
                },
                {
                  label: "View Batches", icon: "bi-collection-fill", bg: "#fd7e14",
                  action: () => setActiveTab("batches")
                }
              ].map((item, idx) => (
                <div className="col-md-3" key={idx}>
                  <div className="card border-0 shadow h-100" onClick={item.action}
                    style={{
                      borderRadius: '12px', background: 'white', cursor: 'pointer',
                      transition: 'all 0.25s ease'
                    }}
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

            {/* Student History with search */}
            <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-clock-history me-2" style={{ color: '#4a9eff' }}></i>Student History
                </h5>
                <div className="input-group" style={{ width: '280px' }}>
                  <span className="input-group-text bg-white border-end-0" style={{ borderRadius: '8px 0 0 8px' }}>
                    <i className="bi bi-search" style={{ color: '#4a9eff' }}></i>
                  </span>
                  <input type="text" className="form-control border-start-0" style={{ borderRadius: '0 8px 8px 0' }}
                    placeholder="Search by name, email, course..."
                    value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                </div>
              </div>
              {students.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  <p className="mb-0">No students yet</p>
                </div>
              ) : (() => {
                const q = historySearch.toLowerCase();
                const filtered = students.filter(s =>
                  s.name?.toLowerCase().includes(q) ||
                  s.email?.toLowerCase().includes(q) ||
                  s.course?.toLowerCase().includes(q) ||
                  s.batch?.toLowerCase().includes(q) ||
                  s.status?.toLowerCase().includes(q)
                ).slice().reverse();
                return (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                          <th className="py-3 ps-4 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Student</th>
                          <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Email</th>
                          <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Course</th>
                          <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Batch</th>
                          <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Enrolled</th>
                          <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(student => (
                          <tr key={student.id} className="align-middle">
                            <td className="py-3 ps-4">
                              <div className="d-flex align-items-center">
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                                  <i className="bi bi-person-fill" style={{ color: '#4a9eff', fontSize: '0.9rem' }}></i>
                                </div>
                                <span className="fw-semibold" style={{ fontSize: '0.9rem' }}>{student.name}</span>
                              </div>
                            </td>
                            <td className="py-3"><small className="text-muted">{student.email}</small></td>
                            <td className="py-3" style={{ fontSize: '0.9rem' }}>{student.course || 'N/A'}</td>
                            <td className="py-3">
                              <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>
                                {student.batch || 'Not Assigned'}
                              </span>
                            </td>
                            <td className="py-3">
                              <small className="text-muted">
                                {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                              </small>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"}`}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                              No students matching &quot;{historySearch}&quot; found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* ─── Students Table ──────────────────────────────────────── */}
        {activeTab === "students" && (
          <div className="card border-0 shadow" style={{ borderRadius: "12px", overflow: "hidden" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#4a9eff' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#1a1e2b", color: "white" }}>
                    <tr>
                      <th className="py-3 ps-4">Student</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3">Course</th>
                      <th className="py-3">Batch</th>
                      <th className="py-3">Enrollment</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="align-middle">
                        <td className="py-3 ps-4">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                              style={{ width: "35px", height: "35px", background: '#e6f0ff' }}>
                              <i className="bi bi-person-circle" style={{ color: '#4a9eff' }}></i>
                            </div>
                            <div>
                              <div className="fw-semibold">{student.name}</div>
                              <small className="text-muted">{student.email}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">{student.phone || 'N/A'}</td>
                        <td className="py-3">{student.course || 'N/A'}</td>
                        <td className="py-3">
                          <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>
                            {student.batch || 'Not Assigned'}
                          </span>
                        </td>
                        <td className="py-3">
                          {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3">
                          <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="btn btn-sm me-2" title="View"
                            style={{ background: '#e6f0ff', color: '#4a9eff', borderRadius: '8px' }}
                            onClick={() => handleViewClick(student)}>
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button className="btn btn-sm me-2" title="Edit"
                            style={{ background: '#fff3cd', color: '#856404', borderRadius: '8px' }}
                            onClick={() => handleEditClick(student)}>
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button className="btn btn-sm" title="Delete"
                            style={{ background: '#ffe6e6', color: '#dc3545', borderRadius: '8px' }}
                            onClick={() => handleDeleteClick(student)}>
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                          No students found. Click &quot;Add Student&quot; to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Batches Table ───────────────────────────────────────── */}
        {activeTab === "batches" && (
          <div className="card border-0 shadow" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: "#1a1e2b", color: "white" }}>
                  <tr>
                    <th className="py-3 ps-4">Batch Name</th>
                    <th className="py-3">Course</th>
                    <th className="py-3">Trainer</th>
                    <th className="py-3">Duration</th>
                    <th className="py-3">Mode</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Students</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(batch => (
                    <tr key={batch.id} className="align-middle">
                      <td className="py-3 ps-4">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: "35px", height: "35px", background: '#e6f0ff' }}>
                            <i className="bi bi-collection-fill" style={{ color: '#4a9eff' }}></i>
                          </div>
                          <span className="fw-semibold">{batch.batchName}</span>
                        </div>
                      </td>
                      <td className="py-3">{batch.course}</td>
                      <td className="py-3">{batch.trainer}</td>
                      <td className="py-3">
                        <small>
                          {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                        </small>
                      </td>
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
                        <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>
                          {students.filter(s => s.batch === batch.batchName).length}/{batch.maxStudents}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="btn btn-sm btn-info text-white"
                          style={{ borderRadius: '8px' }}
                          onClick={() => { setSelectedBatch(batch); setShowBatchStudentsModal(true); }}>
                          <i className="bi bi-eye-fill me-1"></i>View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {batches.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                        No batches available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── All Modals ───────────────────────────────────────────── */}
      <ViewStudentModal show={showViewModal}
        onClose={() => { setShowViewModal(false); setSelectedStudent(null); }}
        student={selectedStudent} />

      <DeleteConfirmationModal show={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setStudentToDelete(null); }}
        onConfirm={confirmDelete}
        studentName={studentToDelete?.name} />

      <LogoutConfirmationModal show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout} />

      <AddStudentModal show={showAddStudentModal}
        onClose={handleCloseAddModal}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        editingStudent={editingStudent}
        onSave={handleSaveAddModal}
        onCancel={handleCancelAddModal} />

      <AssignBatchModal show={showAssignBatchModal}
        onClose={() => { setShowAssignBatchModal(false); setSelectedStudent(null); }}
        students={students}
        batches={batches}
        onAssign={handleAssignBatch} />

      <ViewBatchStudentsModal show={showBatchStudentsModal}
        onClose={() => { setShowBatchStudentsModal(false); setSelectedBatch(null); }}
        batch={selectedBatch}
        students={students} />
    </div>
  );
};

export default CounsellorDashboard;