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

// ─── Modals ────────────────────────────────────────────────────────────

const AddStudentModal = ({ show, onClose, newStudent, setNewStudent, editingStudent, onSave, onCancel }) => {
    if (!show) return null;
    const handleSubmit = (e) => { e.preventDefault(); onSave(); };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className={`bi ${editingStudent ? "bi-pencil-square" : "bi-person-plus"} me-2`} style={{ color: '#fd7e14' }}></i>
                            {editingStudent ? 'Edit Student' : 'Add New Student'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Full Name <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-person"></i></span>
                                        <input type="text" className="form-control border-0 bg-light" placeholder="Enter full name" value={newStudent.name}
                                            onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required autoFocus />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Email <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-envelope"></i></span>
                                        <input type="email" className="form-control border-0 bg-light" placeholder="Enter email" value={newStudent.email}
                                            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Phone</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-telephone"></i></span>
                                        <input type="tel" className="form-control border-0 bg-light" placeholder="Enter phone number" value={newStudent.phone}
                                            onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Course <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-book"></i></span>
                                        <input type="text" className="form-control border-0 bg-light" placeholder="Enter course" value={newStudent.course}
                                            onChange={e => setNewStudent({ ...newStudent, course: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Status</label>
                                    <select className="form-select border-0 bg-light" value={newStudent.status}
                                        onChange={e => setNewStudent({ ...newStudent, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold">Enrollment Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-calendar"></i></span>
                                        <input type="date" className="form-control border-0 bg-light" value={newStudent.enrollmentDate}
                                            onChange={e => setNewStudent({ ...newStudent, enrollmentDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light" style={{ borderRadius: '0 0 15px 15px' }}>
                            <button type="button" className="btn btn-light px-4" onClick={onCancel}>Cancel</button>
                            <button type="submit" className="btn text-white px-4" style={{ background: '#fd7e14', border: 'none' }}>
                                <i className={`bi ${editingStudent ? "bi-check-lg" : "bi-plus-lg"} me-2`}></i>
                                {editingStudent ? 'Update' : 'Add'} Student
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ViewStudentModal = ({ show, onClose, student }) => {
    if (!show || !student) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className="bi bi-person-lines-fill me-2" style={{ color: '#fd7e14' }}></i>Student Details
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="text-center mb-4">
                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '80px', height: '80px', background: 'rgba(253,126,20,0.1)' }}>
                                <i className="bi bi-person-fill" style={{ fontSize: '2.5rem', color: '#fd7e14' }}></i>
                            </div>
                            <h5 className="fw-bold mb-1">{student.name}</h5>
                            <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"}`}>{student.status}</span>
                        </div>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded-3">
                                    <small className="text-muted d-block"><i className="bi bi-envelope me-1"></i>Email</small>
                                    <span className="fw-semibold">{student.email || "N/A"}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded-3">
                                    <small className="text-muted d-block"><i className="bi bi-telephone me-1"></i>Phone</small>
                                    <span className="fw-semibold">{student.phone || "N/A"}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded-3">
                                    <small className="text-muted d-block"><i className="bi bi-book me-1"></i>Course</small>
                                    <span className="fw-semibold">{student.course || "N/A"}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="bg-light p-3 rounded-3">
                                    <small className="text-muted d-block"><i className="bi bi-collection me-1"></i>Batch</small>
                                    <span className="badge" style={{ background: 'rgba(253,126,20,0.1)', color: '#fd7e14' }}>
                                        {student.batch || "Not Assigned"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="bg-light p-3 rounded-3">
                                    <small className="text-muted d-block"><i className="bi bi-calendar me-1"></i>Enrollment Date</small>
                                    <span className="fw-semibold">{student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : "N/A"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 bg-light" style={{ borderRadius: '0 0 15px 15px' }}>
                        <button type="button" className="btn btn-light w-100" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmationModal = ({ show, onClose, onConfirm, itemName, type }) => {
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
                            <h5 className="fw-bold mb-2">Delete {type}</h5>
                            <p className="text-muted mb-0">
                                Are you sure you want to delete <span className="fw-bold text-dark">{itemName}</span>?<br />
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

const AssignBatchModal = ({ show, onClose, students, batches, onAssign }) => {
    if (!show) return null;
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");

    const handleAssign = () => {
        const student = students.find((s) => String(s.id) === selectedStudentId);
        const batch = batches.find((b) => String(b.id) === selectedBatchId);
        if (student && batch) {
            onAssign(student.id, batch.batchName, batch.course, batch);
            setSelectedStudentId("");
            setSelectedBatchId("");
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className="bi bi-arrow-repeat me-2" style={{ color: '#fd7e14' }}></i>Assign Batch
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Select Student <span className="text-danger">*</span></label>
                            <select className="form-select border-0 bg-light" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                                <option value="">-- Choose a student --</option>
                                {students.filter(s => !s.batch || s.batch.trim() === "").map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-semibold">Select Batch <span className="text-danger">*</span></label>
                            <select className="form-select border-0 bg-light" value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)}>
                                <option value="">-- Choose a batch --</option>
                                {batches.map(b => (
                                    <option key={b.id} value={b.id}>{b.batchName} - {b.course}</option>
                                ))}
                            </select>
                        </div>
                        {selectedBatchId && (() => {
                            const batch = batches.find((b) => String(b.id) === selectedBatchId);
                            return batch ? (
                                <div className="card bg-light border-0 mt-2 rounded-3">
                                    <div className="card-body py-2">
                                        <small className="d-block">
                                            <strong>{batch.batchName}</strong> • {batch.course} • Trainer: {batch.trainer}<br />
                                            Status: {batch.status} • Enrolled: {batch.studentsEnrolled || 0}/{batch.maxStudents}
                                        </small>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>
                    <div className="modal-footer border-0 bg-light" style={{ borderRadius: '0 0 15px 15px' }}>
                        <button className="btn btn-light px-4" onClick={onClose}>Cancel</button>
                        <button className="btn text-white px-4" style={{ background: '#fd7e14', border: 'none' }}
                            onClick={handleAssign} disabled={!selectedStudentId || !selectedBatchId}>
                            <i className="bi bi-check-lg me-2"></i>Assign Batch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewBatchStudentsModal = ({ show, onClose, batch, students }) => {
    if (!show || !batch) return null;
    const enrolled = students.filter(s => s.batch === batch.batchName);
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className="bi bi-people-fill me-2" style={{ color: '#fd7e14' }}></i>Students in {batch.batchName}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0">
                        <div className="p-4 border-bottom bg-light">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "36px", height: "36px", background: "white", flexShrink: 0 }}>
                                            <i className="bi bi-book" style={{ color: '#fd7e14' }} />
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Course</small>
                                            <span className="fw-semibold">{batch.course}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "36px", height: "36px", background: "white", flexShrink: 0 }}>
                                            <i className="bi bi-people" style={{ color: '#fd7e14' }} />
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Students Enrolled</small>
                                            <span className="fw-semibold">{enrolled.length} / {batch.maxStudents}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "36px", height: "36px", background: "white", flexShrink: 0 }}>
                                            <i className="bi bi-calendar-event" style={{ color: '#fd7e14' }} />
                                        </div>
                                        <div>
                                            <small className="text-muted d-block">Duration</small>
                                            <span className="fw-semibold">
                                                {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive p-3">
                            <table className="table table-hover mb-0">
                                <thead style={{ background: "#1a1e2b", color: "white" }}>
                                    <tr>
                                        <th className="py-2 rounded-start ps-3">Name</th>
                                        <th className="py-2">Email</th>
                                        <th className="py-2">Phone</th>
                                        <th className="py-2 rounded-end">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolled.length > 0 ? enrolled.map(s => (
                                        <tr key={s.id}>
                                            <td className="py-2 ps-3 fw-semibold">{s.name}</td>
                                            <td className="py-2">{s.email}</td>
                                            <td className="py-2">{s.phone || "—"}</td>
                                            <td className="py-2">
                                                <span className={`badge ${s.status === "Active" ? "bg-success" : "bg-danger"}`}>{s.status}</span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-muted">No students assigned to this batch.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer border-0 bg-light" style={{ borderRadius: '0 0 15px 15px' }}>
                        <button type="button" className="btn btn-light px-4" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// ─── MAIN COUNSELLOR DASHBOARD ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
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
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [newStudent, setNewStudent] = useState({ name: "", email: "", phone: "", course: "", batch: "", enrollmentDate: new Date().toISOString().split("T")[0], status: "Active" });
    const [editingStudent, setEditingStudent] = useState(null);

    const [toasts, setToasts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [hoveredTab, setHoveredTab] = useState(null);

    const currentUser = {
        id: localStorage.getItem("userId"),
        name: localStorage.getItem("userName") || "Counsellor",
        email: localStorage.getItem("userEmail") || "counsellor@example.com",
        role: localStorage.getItem("role") || "COUNSELOR"
    };

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const fetchBatches = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/batches`);
            setBatches(res.data);
        } catch (e) {
            console.error("Error fetching batches", e);
            setBatches([]);
        }
    }, []);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/students`);
            setStudents(res.data);
        } catch (e) {
            console.error("Error fetching students", e);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
        fetchBatches();
    }, [fetchStudents, fetchBatches]);

    const filteredStudents = students.filter((s) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
            (s.name && s.name.toLowerCase().includes(term)) ||
            (s.email && s.email.toLowerCase().includes(term)) ||
            (s.phone && s.phone.toLowerCase().includes(term)) ||
            (s.course && s.course.toLowerCase().includes(term)) ||
            (s.batch && s.batch.toLowerCase().includes(term))
        );
    });

    const stats = {
        totalStudents: students.length,
        activeStudents: students.filter((s) => s.status === "Active").length,
        inactiveStudents: students.filter((s) => s.status === "Inactive").length,
        totalBatches: batches.length,
        ongoingBatches: batches.filter((b) => b.status === "Ongoing").length,
    };

    const resetForm = () => {
        setNewStudent({ name: "", email: "", phone: "", course: "", batch: "", enrollmentDate: new Date().toISOString().split("T")[0], status: "Active" });
        setEditingStudent(null);
    };

    const handleSaveAddModal = async () => {
        if (!newStudent.name || !newStudent.email || !newStudent.course) {
            showToast("Please fill all required fields", "warning");
            return;
        }
        const generatedId = typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const payload = { ...newStudent, id: generatedId };
        try {
            const res = await axios.post(`${API_URL}/students`, payload);
            setStudents((prev) => [...prev, res.data]);
            resetForm();
            setShowAddStudentModal(false);
            showToast("Student added successfully", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to add student", "error");
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setNewStudent({ ...student });
        setShowAddStudentModal(true);
    };

    const handleUpdateStudent = async () => {
        if (!editingStudent) return;
        try {
            const res = await axios.put(`${API_URL}/students/${editingStudent.id}`, newStudent);
            setStudents((prev) => prev.map((s) => (s.id === editingStudent.id ? res.data : s)));
            resetForm();
            setShowAddStudentModal(false);
            showToast("Student updated", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to update student", "error");
        }
    };

    const handleDeleteClick = (student) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await axios.delete(`${API_URL}/students/${studentToDelete.id}`);
            if (studentToDelete.batch && studentToDelete.batch.trim() !== "") {
                const batchObj = batches.find((b) => b.batchName === studentToDelete.batch);
                if (batchObj && (batchObj.studentsEnrolled || 0) > 0) {
                    const updatedCount = (batchObj.studentsEnrolled || 0) - 1;
                    await axios.patch(`${API_URL}/batches/${batchObj.id}`, { studentsEnrolled: updatedCount });
                    fetchBatches();
                }
            }
            setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
            setShowDeleteModal(false);
            setStudentToDelete(null);
            showToast("Student deleted", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to delete student", "error");
        }
    };

    const handleViewClick = (student) => {
        setSelectedStudent(student);
        setShowViewModal(true);
    };

    const handleAssignBatch = async (studentId, batchName, course, batchObj) => {
        try {
            await axios.patch(`${API_URL}/students/${studentId}`, { batch: batchName, course });
            const updatedCount = (batchObj.studentsEnrolled || 0) + 1;
            await axios.patch(`${API_URL}/batches/${batchObj.id}`, { studentsEnrolled: updatedCount });
            setShowAssignBatchModal(false);
            fetchStudents();
            fetchBatches();
            showToast("Batch assigned successfully", "success");
        } catch (e) {
            console.error(e);
            showToast("Failed to assign batch", "error");
        }
    };

    const handleBatchView = (batch) => {
        setSelectedBatch(batch);
        setShowBatchStudentsModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        localStorage.clear();
        navigate("/login");
    };

    // ─── Sidebar config ────────────────────────────────────────────
    const sidebarTabs = [
        { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2", color: "#fd7e14" },
        { key: "students", label: "Students", icon: "bi-people", color: "#4a9eff" },
        { key: "batches", label: "Batches", icon: "bi-collection", color: "#28a745" }
    ];

    const sidebarStyles = {
        navItem: { transition: "all 0.3s ease-in-out", cursor: "pointer", position: "relative", overflow: "hidden" },
        navItemHover: (color) => ({
            transform: "translateX(6px)", background: `linear-gradient(90deg, ${color}22 0%, transparent 100%)`,
            borderLeft: `4px solid ${color}`, boxShadow: `0 4px 15px rgba(0,0,0,0.1)`
        }),
        navItemActive: (color) => ({
            background: `linear-gradient(90deg, ${color}33 0%, ${color}10 100%)`,
            borderLeft: `4px solid ${color}`, boxShadow: `0 4px 15px ${color}22`, color
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

                    {/* Header */}
                    <div className="d-flex align-items-center mb-4" style={{ justifyContent: sidebarOpen ? "space-between" : "center" }}>
                        {sidebarOpen && <h4 className="fw-bold mb-0" style={{ color: "#fd7e14", whiteSpace: "nowrap" }}>CrewSync</h4>}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            style={{
                                background: "rgba(255,255,255,0.08)", border: "none", color: "#fd7e14",
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
                        title={!sidebarOpen ? `${currentUser.name} (Counsellor)` : undefined}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{
                                width: sidebarOpen ? "80px" : "40px", height: sidebarOpen ? "80px" : "40px",
                                background: "#2a2f3c", transition: "all 0.3s ease",
                                transform: hoveredTab === "profile" ? "scale(1.05)" : "scale(1)",
                                boxShadow: hoveredTab === "profile" ? "0 0 20px rgba(253,126,20,0.3)" : "none"
                            }}>
                            <i className="bi bi-chat-heart-fill" style={{ fontSize: sidebarOpen ? "2.2rem" : "1.2rem", color: "#fd7e14" }}></i>
                        </div>
                        {sidebarOpen && (
                            <>
                                <h6 className="text-white mb-1 mt-3">{currentUser.name}</h6>
                                <p className="text-white-50 small mb-2">{currentUser.email}</p>
                                <span className="badge px-3 py-2" style={{ background: 'linear-gradient(135deg, #fd7e14, #d15c00)' }}>Counsellor</span>
                            </>
                        )}
                    </div>

                    {sidebarOpen && <p className="text-white-50 small mb-4">Advisory & Batches</p>}

                    <nav className="nav flex-column">
                        {sidebarTabs.map(tab => {
                            const isActive = activeTab === tab.key;
                            const isHovered = hoveredTab === tab.key;
                            const accentColor = isActive ? tab.color : (isHovered ? tab.color : "white");

                            return (
                                <button key={tab.key}
                                    className={`nav-link border-0 bg-transparent mb-2 py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                                    onClick={() => setActiveTab(tab.key)}
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
                                    {sidebarOpen && tab.key === "students" && (
                                        <span className="badge ms-auto" style={{
                                            background: isActive ? tab.color : (isHovered ? tab.color : 'rgba(255,255,255,0.15)'), transition: 'background 0.3s ease'
                                        }}>{students.length}</span>
                                    )}
                                    {sidebarOpen && tab.key === "batches" && (
                                        <span className="badge ms-auto" style={{
                                            background: isActive ? tab.color : (isHovered ? tab.color : 'rgba(255,255,255,0.15)'), transition: 'background 0.3s ease'
                                        }}>{batches.length}</span>
                                    )}
                                </button>
                            );
                        })}

                        <hr className="my-3" style={{ background: 'rgba(255,255,255,0.1)' }} />

                        <button className={`nav-link border-0 bg-transparent py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                            onClick={() => setShowLogoutModal(true)}
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
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0" style={{ color: "#1a1e2b" }}>
                                <i className="bi bi-speedometer2 me-2" style={{ color: '#fd7e14' }}></i>Dashboard Overview
                            </h4>
                        </div>

                        {/* Stats Cards Row */}
                        <div className="row g-4 mb-4">
                            {[
                                { label: "Total Students", value: stats.totalStudents, icon: "bi-people-fill", bg: "linear-gradient(135deg, #4a9eff 0%, #2774b0 100%)" },
                                { label: "Active Students", value: stats.activeStudents, icon: "bi-check-circle-fill", bg: "linear-gradient(135deg, #84fab0 0%, #44c78e 100%)" },
                                { label: "Inactive Students", value: stats.inactiveStudents, icon: "bi-x-circle-fill", bg: "linear-gradient(135deg, #ff7b89 0%, #dc3545 100%)" },
                                { label: "Total Batches", value: stats.totalBatches, icon: "bi-collection-fill", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }
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
                                { label: "Add Student", icon: "bi-person-plus-fill", bg: "#4a9eff", action: () => { resetForm(); setShowAddStudentModal(true); } },
                                { label: "Manage Students", icon: "bi-people-fill", bg: "#fd7e14", action: () => setActiveTab("students") },
                                { label: "Assign Batch", icon: "bi-arrow-repeat", bg: "#8B5CF6", action: () => setShowAssignBatchModal(true) },
                                { label: "View Batches", icon: "bi-collection-fill", bg: "#28a745", action: () => setActiveTab("batches") }
                            ].map((item, idx) => (
                                <div className="col-md-3" key={idx}>
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

                        {/* Recent Students Preview */}
                        <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                                <h6 className="fw-bold mb-0"><i className="bi bi-clock-history me-2" style={{ color: '#fd7e14' }}></i>Recently Added Students</h6>
                                <button className="btn btn-sm btn-light" onClick={() => setActiveTab("students")}>View All</button>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ background: '#f8f9fa' }}>
                                        <tr>
                                            <th className="py-3 ps-4 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Student</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Course</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Status</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...students].reverse().slice(0, 5).map(student => (
                                            <tr key={student.id}>
                                                <td className="py-3 ps-4">
                                                    <div className="fw-semibold">{student.name}</div>
                                                    <small className="text-muted">{student.email}</small>
                                                </td>
                                                <td className="py-3">{student.course}</td>
                                                <td className="py-3">
                                                    <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"}`}>{student.status}</span>
                                                </td>
                                                <td className="py-3">
                                                    <button className="btn btn-sm btn-info text-white me-1" style={{ borderRadius: '8px' }} onClick={() => handleViewClick(student)}>
                                                        <i className="bi bi-eye-fill"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {students.length === 0 && (
                                            <tr><td colSpan="4" className="text-center py-4 text-muted">No students found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── Students Tab ────────────────────────────────────── */}
                {activeTab === "students" && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0" style={{ color: "#1a1e2b" }}>
                                <i className="bi bi-people me-2" style={{ color: '#4a9eff' }}></i>Student Management
                            </h4>
                            <div className="d-flex gap-2">
                                <button className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none', borderRadius: '10px' }}
                                    onClick={() => { resetForm(); setShowAddStudentModal(true); }}>
                                    <i className="bi bi-person-plus me-2"></i>Add Student
                                </button>
                                <button className="btn text-white px-4 py-2" style={{ background: '#1a1e2b', border: 'none', borderRadius: '10px' }}
                                    onClick={() => setShowAssignBatchModal(true)}>
                                    <i className="bi bi-arrow-repeat me-2"></i>Assign Batch
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="card border-0 shadow mb-4" style={{ borderRadius: '12px' }}>
                            <div className="card-body">
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
                                    <input type="text" className="form-control border-0 bg-light" placeholder="Search by name, email, phone, or course..."
                                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border" style={{ color: '#4a9eff' }} role="status"><span className="visually-hidden">Loading...</span></div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead style={{ background: '#1a1e2b', color: 'white' }}>
                                            <tr>
                                                <th className="py-3 ps-4">Student</th>
                                                <th className="py-3">Contact</th>
                                                <th className="py-3">Course</th>
                                                <th className="py-3">Batch</th>
                                                <th className="py-3">Status</th>
                                                <th className="py-3 text-end pe-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                                <tr key={student.id}>
                                                    <td className="py-3 ps-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                                                                <i className="bi bi-person-fill" style={{ color: '#4a9eff' }}></i>
                                                            </div>
                                                            <div className="fw-semibold">{student.name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <div>{student.email}</div>
                                                        <small className="text-muted">{student.phone || "—"}</small>
                                                    </td>
                                                    <td className="py-3">{student.course}</td>
                                                    <td className="py-3">
                                                        <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>{student.batch || "Not Assigned"}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"}`}>{student.status}</span>
                                                    </td>
                                                    <td className="py-3 text-end pe-4">
                                                        <button className="btn btn-sm btn-info text-white me-1" style={{ borderRadius: '8px' }} onClick={() => handleViewClick(student)}>
                                                            <i className="bi bi-eye-fill"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-warning text-white me-1" style={{ borderRadius: '8px' }} onClick={() => handleEditClick(student)}>
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-danger text-white" style={{ borderRadius: '8px' }} onClick={() => handleDeleteClick(student)}>
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr><td colSpan="6" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-3"></i>No students found</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── Batches Tab ─────────────────────────────────────── */}
                {activeTab === "batches" && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0" style={{ color: "#1a1e2b" }}>
                                <i className="bi bi-collection me-2" style={{ color: '#28a745' }}></i>Batch Overview
                            </h4>
                            <button className="btn text-white px-4 py-2" style={{ background: '#1a1e2b', border: 'none', borderRadius: '10px' }}
                                onClick={() => setShowAssignBatchModal(true)}>
                                <i className="bi bi-arrow-repeat me-2"></i>Assign Student to Batch
                            </button>
                        </div>

                        <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead style={{ background: '#1a1e2b', color: 'white' }}>
                                        <tr>
                                            <th className="py-3 ps-4">Batch Name</th>
                                            <th className="py-3">Course</th>
                                            <th className="py-3">Trainer</th>
                                            <th className="py-3">Duration</th>
                                            <th className="py-3">Mode & Status</th>
                                            <th className="py-3 text-center">Students</th>
                                            <th className="py-3 text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batches.length > 0 ? batches.map(batch => (
                                            <tr key={batch.id}>
                                                <td className="py-3 ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                            style={{ width: '34px', height: '34px', background: '#e8f5e9', flexShrink: 0 }}>
                                                            <i className="bi bi-collection-fill" style={{ color: '#28a745' }}></i>
                                                        </div>
                                                        <span className="fw-semibold">{batch.batchName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">{batch.course}</td>
                                                <td className="py-3">{batch.trainer}</td>
                                                <td className="py-3">
                                                    <small>{new Date(batch.startDate).toLocaleDateString()} - <br />{new Date(batch.endDate).toLocaleDateString()}</small>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`badge me-1 ${batch.mode === "Online" ? "bg-success" : batch.mode === "Offline" ? "bg-primary" : "bg-warning"}`}>{batch.mode}</span>
                                                    <span className={`badge ${batch.status === "Ongoing" ? "bg-success" : batch.status === "Completed" ? "bg-secondary" : "bg-primary"}`}>{batch.status}</span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className="badge" style={{ background: '#e8f5e9', color: '#28a745' }}>
                                                        {students.filter(s => s.batch === batch.batchName).length} / {batch.maxStudents}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-end pe-4">
                                                    <button className="btn btn-sm btn-info text-white" style={{ borderRadius: '8px' }} onClick={() => handleBatchView(batch)}>
                                                        <i className="bi bi-eye-fill me-1"></i>View
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="7" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-3"></i>No batches available.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Modals */}
            <AddStudentModal show={showAddStudentModal} onClose={() => { resetForm(); setShowAddStudentModal(false); }}
                newStudent={newStudent} setNewStudent={setNewStudent} editingStudent={editingStudent}
                onSave={editingStudent ? handleUpdateStudent : handleSaveAddModal} onCancel={() => { resetForm(); setShowAddStudentModal(false); }} />
            <ViewStudentModal show={showViewModal} onClose={() => setShowViewModal(false)} student={selectedStudent} />
            <DeleteConfirmationModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete} itemName={studentToDelete?.name} type="Student" />
            <LogoutConfirmationModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
            <AssignBatchModal show={showAssignBatchModal} onClose={() => setShowAssignBatchModal(false)}
                students={students} batches={batches} onAssign={handleAssignBatch} />
            <ViewBatchStudentsModal show={showBatchStudentsModal} onClose={() => setShowBatchStudentsModal(false)}
                batch={selectedBatch} students={students} />

        </div>
    );
};

export default CounsellorDashboard;