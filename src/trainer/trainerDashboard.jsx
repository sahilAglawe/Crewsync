import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "../api";

const API_URL = "http://localhost:8080";

// ─── Toast ─────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
    return (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
            {toasts.map(t => <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />)}
        </div>
    );
}
function Toast({ toast, onClose }) {
    const [exiting, setExiting] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => { setExiting(true); setTimeout(onClose, 300); }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);
    const colors = { success: { bg: '#d1e7dd', border: '#28a745', text: '#0f5132', icon: '#28a745' }, error: { bg: '#f8d7da', border: '#dc3545', text: '#842029', icon: '#dc3545' }, warning: { bg: '#fff3cd', border: '#ffc107', text: '#664d03', icon: '#ffc107' }, info: { bg: '#cff4fc', border: '#0dcaf0', text: '#055160', icon: '#0dcaf0' } };
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
    const c = colors[toast.type] || colors.info;
    return (
        <div style={{ background: c.bg, borderLeft: `4px solid ${c.border}`, borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', color: c.text, animation: exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.35s ease', minWidth: '300px' }}>
            <i className={`bi ${icons[toast.type]}`} style={{ fontSize: '1.3rem', color: c.icon }}></i>
            <span style={{ flex: 1, fontWeight: 500, fontSize: '0.92rem' }}>{toast.message}</span>
            <button onClick={() => { setExiting(true); setTimeout(onClose, 300); }} style={{ background: 'none', border: 'none', color: c.text, cursor: 'pointer', fontSize: '1.1rem', padding: 0, opacity: 0.6 }}><i className="bi bi-x-lg"></i></button>
            <style>{`@keyframes toastIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}} @keyframes toastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(120%);opacity:0}}`}</style>
        </div>
    );
}

// ─── Logout Modal ─────────────────────────────────────────────────────────
function LogoutModal({ show, onClose, onConfirm }) {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-body text-center p-4">
                        <div className="rounded-circle d-inline-flex p-3 mb-3" style={{ background: '#fff3cd' }}>
                            <i className="bi bi-box-arrow-right" style={{ fontSize: '2.5rem', color: '#ffc107' }}></i>
                        </div>
                        <h5 className="fw-bold mb-2">Confirm Logout</h5>
                        <p className="text-muted mb-4">Are you sure you want to logout from your account?</p>
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

// ─── Batch Progress Modal (Add / Edit) ───────────────────────────────────
function BatchProgressModal({ show, onClose, onSave, editing, myBatches }) {
    const [form, setForm] = useState({ batchId: '', title: '', description: '', documentName: '', documentData: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (editing) {
            setForm({ batchId: editing.batchId || '', title: editing.title || '', description: editing.description || '', documentName: editing.documentName || '', documentData: editing.documentData || '' });
        } else {
            setForm({ batchId: '', title: '', description: '', documentName: '', documentData: '' });
        }
    }, [editing, show]);

    if (!show) return null;

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { // Allow up to 5MB
            alert('File size must be under 5MB');
            e.target.value = '';
            return;
        }
        setUploading(true);
        const reader = new FileReader();
        reader.onload = (ev) => { setForm(f => ({ ...f, documentName: file.name, documentData: ev.target.result })); setUploading(false); };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.batchId || !form.title.trim()) return;
        onSave(form);
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="modal-header border-0 pb-0" style={{ background: 'linear-gradient(135deg,#1a1e2b,#2a2f3c)', borderRadius: '16px 16px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className={`bi ${editing ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{ color: '#4a9eff' }}></i>
                            {editing ? 'Edit Batch Progress' : 'Add Batch Progress'}
                        </h5>
                        <button className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Select Batch <span className="text-danger">*</span></label>
                                    <select className="form-select" value={form.batchId} onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))} required disabled={!!editing}>
                                        <option value="">-- Choose your batch --</option>
                                        {myBatches.map(b => <option key={b.id} value={b.id}>{b.batchName} — {b.course}</option>)}
                                    </select>
                                    {myBatches.length === 0 && <small className="text-danger mt-1 d-block"><i className="bi bi-exclamation-triangle me-1"></i>You are not assigned to any batch. Please contact admin.</small>}
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Title <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" placeholder="e.g. Week 3 Progress Update" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Description</label>
                                    <textarea className="form-control" rows="4" placeholder="Describe the progress, topics covered, student performance..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold small">Upload Document <span className="text-muted">(PDF, DOC, DOCX, images — max 5MB)</span></label>
                                    <div className="border rounded p-3" style={{ background: '#f8f9fa', borderStyle: 'dashed !important', borderColor: '#dee2e6' }}>
                                        <input type="file" className="form-control" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif" onChange={handleFile} />
                                        {uploading && <div className="mt-2 text-info small"><i className="bi bi-arrow-repeat me-1"></i>Loading file...</div>}
                                        {form.documentName && !uploading && (
                                            <div className="mt-2 d-flex align-items-center gap-2 p-2 rounded" style={{ background: '#e6f0ff' }}>
                                                <i className="bi bi-file-earmark-check text-primary"></i>
                                                <span className="small fw-semibold text-primary">{form.documentName}</span>
                                                <button type="button" className="btn btn-sm ms-auto" style={{ color: '#dc3545', padding: '0 4px' }} onClick={() => setForm(f => ({ ...f, documentName: '', documentData: '' }))}><i className="bi bi-x-circle"></i></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-light px-4 py-2" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none', borderRadius: '8px' }} disabled={uploading}>
                                <i className={`bi ${editing ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                {editing ? 'Update Progress' : 'Save Progress'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ─── View Progress Modal ──────────────────────────────────────────────────
function ViewProgressModal({ show, onClose, progress, batchName }) {
    if (!show || !progress) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '16px' }}>
                    <div className="modal-header border-0" style={{ background: 'linear-gradient(135deg,#1a1e2b,#2a2f3c)', borderRadius: '16px 16px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold"><i className="bi bi-bar-chart-line me-2" style={{ color: '#4a9eff' }}></i>Progress Details</h5>
                        <button className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="text-center mb-4">
                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', background: '#e6f0ff' }}>
                                <i className="bi bi-bar-chart-line-fill" style={{ fontSize: '2rem', color: '#4a9eff' }}></i>
                            </div>
                            <h5 className="fw-bold mb-1">{progress.title}</h5>
                            <span className="badge px-3 py-2" style={{ background: '#4a9eff' }}>{batchName}</span>
                        </div>
                        <div className="list-group list-group-flush">
                            <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                                <span className="text-muted"><i className="bi bi-calendar3 me-2"></i>Date Added</span>
                                <span className="fw-semibold">{progress.createdAt ? new Date(progress.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                            </div>
                            {progress.description && (
                                <div className="list-group-item px-0 border-0 py-2">
                                    <span className="text-muted d-block mb-2"><i className="bi bi-text-paragraph me-2"></i>Description</span>
                                    <p className="mb-0 p-3 rounded" style={{ background: '#f8f9fa', fontSize: '0.9rem', lineHeight: 1.6 }}>{progress.description}</p>
                                </div>
                            )}
                            {progress.documentName && (
                                <div className="list-group-item px-0 border-0 py-2">
                                    <span className="text-muted d-block mb-2"><i className="bi bi-paperclip me-2"></i>Attached Document</span>
                                    <a href={progress.documentData} download={progress.documentName}
                                        className="d-flex align-items-center gap-2 p-3 rounded text-decoration-none" style={{ background: '#e6f0ff', color: '#1a6fc4' }}>
                                        <i className="bi bi-file-earmark-arrow-down fs-5"></i>
                                        <span className="fw-semibold small">{progress.documentName}</span>
                                        <span className="ms-auto badge" style={{ background: '#4a9eff' }}>Download</span>
                                    </a>
                                </div>
                            )}
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

// ─── Delete Modal ─────────────────────────────────────────────────────────
function DeleteModal({ show, onClose, onConfirm, title }) {
    if (!show) return null;
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-body text-center p-4">
                        <div className="rounded-circle d-inline-flex p-3 mb-3" style={{ background: '#ffe6e6' }}>
                            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '2.5rem', color: '#dc3545' }}></i>
                        </div>
                        <h5 className="fw-bold mb-2">Delete Progress</h5>
                        <p className="text-muted mb-4">Are you sure you want to delete <strong>"{title}"</strong>? This cannot be undone.</p>
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

// ═══════════════════════════════════════════════════════════════════════════
// ─── Main TrainerDashboard ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════
const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [batches, setBatches] = useState([]);
    const [students, setStudents] = useState([]);
    const [batchProgress, setBatchProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [hoveredTab, setHoveredTab] = useState(null);

    // modals
    const [showLogout, setShowLogout] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingProgress, setEditingProgress] = useState(null);
    const [viewingProgress, setViewingProgress] = useState(null);
    const [deletingProgress, setDeletingProgress] = useState(null);
    const [progressFilter, setProgressFilter] = useState('all');

    const currentUser = {
        id: localStorage.getItem("userId"),
        name: localStorage.getItem("userName") || "Trainer",
        email: localStorage.getItem("userEmail") || "trainer@example.com",
    };

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);
    const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [bRes, sRes, pRes] = await Promise.all([
                axios.get(`${API_URL}/api/analysts/batches`),
                axios.get(`${API_URL}/api/counsellors/students`),
                axios.get(`${API_URL}/api/trainers/progress`)
            ]);
            const mappedBatches = bRes.data.map(b => ({
                ...b,
                batchName: b.name || b.batchName || "",
                status: b.batchstatus ? b.batchstatus.charAt(0) + b.batchstatus.slice(1).toLowerCase() : (b.status || "Upcoming"),
                mode: b.mode ? b.mode.charAt(0) + b.mode.slice(1).toLowerCase() : (b.mode || "Online"),
                studentsEnrolled: b.studentsEnrolled || 0
            }));
            const myBatches = mappedBatches.filter(b => b.trainerId === currentUser.id || String(b.trainerId) === String(currentUser.id));
            setBatches(myBatches);
            setStudents(sRes.data);
            const myProgress = pRes.data.filter(p => p.trainerId === currentUser.id || String(p.trainerId) === String(currentUser.id));
            setBatchProgress(myProgress);
        } catch (err) {
            console.error("Fetch error:", err);
            showToast("Failed to load data. Please check if the server is running.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ─── helpers ────────────────────────────────────────────────────────
    const getBatchName = (batchId) => {
        const b = batches.find(b => b.id === batchId);
        return b ? `${b.batchName} — ${b.course}` : 'Unknown Batch';
    };
    const getBatchStudentCount = (batchId) => students.filter(s => s.batchId === batchId || s.batch === batches.find(b => b.id === batchId)?.batchName).length;

    // ─── stats ────────────────────────────────────────────────────────
    const stats = {
        myBatches: batches.length,
        totalProgress: batchProgress.length,
        thisMonth: batchProgress.filter(p => { const d = new Date(p.createdAt); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length,
        withDocs: batchProgress.filter(p => p.documentName).length,
    };

    // ─── Save Progress ───────────────────────────────────────────────
    const handleSaveProgress = async (form) => {
        try {
            if (editingProgress) {
                const updated = { ...editingProgress, ...form, updatedAt: new Date().toISOString() };
                await axios.put(`${API_URL}/api/trainers/progress/${editingProgress.id}`, updated);
                setBatchProgress(prev => prev.map(p => p.id === editingProgress.id ? updated : p));
                showToast("Batch progress updated successfully!", "success");
            } else {
                const newp = { ...form, trainerId: currentUser.id, trainerName: currentUser.name, createdAt: new Date().toISOString() };
                const res = await axios.post(`${API_URL}/api/trainers/progress`, newp);
                setBatchProgress(prev => [...prev, res.data]);
                showToast("Batch progress added successfully!", "success");
            }
            setShowProgressModal(false);
            setEditingProgress(null);
        } catch (err) {
            console.error("Save error:", err);
            if (err.response && err.response.status === 413) {
                showToast("File too large. Please upload a smaller file (max 75KB).", "error");
            } else {
                showToast("Failed to save. Please try again.", "error");
            }
        }
    };

    // ─── Delete Progress ─────────────────────────────────────────────
    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/trainers/progress/${deletingProgress.id}`);
            setBatchProgress(prev => prev.filter(p => p.id !== deletingProgress.id));
            setShowDeleteModal(false);
            setDeletingProgress(null);
            showToast("Progress deleted.", "success");
        } catch (err) {
            showToast("Failed to delete.", "error");
        }
    };

    const confirmLogout = () => { localStorage.clear(); navigate("/login"); };

    // Filtered progress
    const filteredProgress = progressFilter === 'all' ? batchProgress : batchProgress.filter(p => p.batchId === progressFilter);

    // ─── Sidebar ─────────────────────────────────────────────────────
    const sidebarTabs = [
        { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2", color: "#4a9eff" },
        { key: "batchProgress", label: "Batch Progress", icon: "bi-bar-chart-line", badge: batchProgress.length, color: "#28a745" },
        { key: "myBatches", label: "My Batches", icon: "bi-grid", badge: batches.length, color: "#fd7e14" },
    ];
    const sidebarStyles = {
        navItem: { transition: "all 0.3s ease-in-out", cursor: "pointer" },
        active: { background: "linear-gradient(90deg,rgba(74,158,255,0.25),rgba(74,158,255,0.08))", borderLeft: "4px solid #4a9eff", color: "#4a9eff" },
        logoutHover: { background: "rgba(255,107,107,0.1)", color: "#ff6b6b", transform: "translateX(5px)", borderLeft: "4px solid #ff6b6b" },
    };

    // ─── RENDER ───────────────────────────────────────────────────────
    return (
        <div className="d-flex" style={{ minHeight: "100vh", background: "#f0f2f7" }}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <style>{`
              .sidebar-tab{transition:all 0.3s ease!important;}
              .sidebar-tab:hover{transform:translateX(4px);}
              .progress-card{transition:all 0.25s ease;}
              .progress-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,0.12)!important;}
              .batch-card{transition:all 0.25s ease;}
              .batch-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(0,0,0,0.12)!important;}
              .stat-card{transition:all 0.3s ease;}
              .stat-card:hover{transform:translateY(-4px);box-shadow:0 12px 35px rgba(0,0,0,0.18)!important;}
            `}</style>

            {/* ─── Sidebar ─────────────────────────────────────────────────── */}
            <div className="text-white shadow-lg" style={{ width: sidebarOpen ? "280px" : "70px", minHeight: "100vh", position: "fixed", background: "linear-gradient(180deg,#1a1e2b 0%,#141722 100%)", borderRight: "1px solid rgba(255,255,255,0.05)", transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)", zIndex: 1050, overflowX: "hidden", overflowY: "auto" }}>
                <div style={{ padding: sidebarOpen ? "1.5rem" : "1.5rem 0.7rem" }}>
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4" style={{ justifyContent: sidebarOpen ? "space-between" : "center" }}>
                        {sidebarOpen && <h4 className="fw-bold mb-0" style={{ color: "#4a9eff", whiteSpace: "nowrap" }}>CrewSync</h4>}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#4a9eff", width: "38px", height: "38px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                            <i className={`bi ${sidebarOpen ? "bi-chevron-left" : "bi-list"}`}></i>
                        </button>
                    </div>

                    {/* Profile */}
                    <div className={`${sidebarOpen ? "text-center" : "d-flex justify-content-center"} mb-4`}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: sidebarOpen ? "75px" : "40px", height: sidebarOpen ? "75px" : "40px", background: "linear-gradient(135deg,#4a9eff,#1a6fc4)" }}>
                            <i className="bi bi-person-fill" style={{ fontSize: sidebarOpen ? "2.2rem" : "1.2rem", color: "white" }}></i>
                        </div>
                        {sidebarOpen && (
                            <>
                                <h6 className="text-white mb-1 mt-3 fw-bold">{currentUser.name}</h6>
                                <p className="text-white-50 small mb-2">{currentUser.email}</p>
                                <span className="badge px-3 py-2 rounded-pill" style={{ background: 'linear-gradient(90deg,#4a9eff,#1a6fc4)' }}>Trainer</span>
                            </>
                        )}
                    </div>

                    {sidebarOpen && <p className="text-white-50 small mb-3 text-uppercase" style={{ letterSpacing: '0.08em', fontSize: '0.72rem' }}>Navigation</p>}

                    <nav className="nav flex-column">
                        {sidebarTabs.map(tab => {
                            const isActive = activeTab === tab.key;
                            const isHov = hoveredTab === tab.key;
                            return (
                                <button key={tab.key}
                                    className={`nav-link border-0 bg-transparent mb-2 py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                                    onClick={() => setActiveTab(tab.key)}
                                    onMouseEnter={() => setHoveredTab(tab.key)} onMouseLeave={() => setHoveredTab(null)}
                                    title={!sidebarOpen ? tab.label : undefined}
                                    style={{ ...sidebarStyles.navItem, color: isActive ? "#4a9eff" : isHov ? tab.color : "white", ...(isActive ? sidebarStyles.active : {}), ...(isHov && !isActive ? { background: `linear-gradient(90deg,${tab.color}22,transparent)`, borderLeft: `4px solid ${tab.color}`, transform: "translateX(5px)" } : {}) }}>
                                    <i className={`bi ${tab.icon} ${sidebarOpen ? "me-2" : ""}`} style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transform: isHov ? "scale(1.2)" : "scale(1)", transition: "transform 0.2s ease" }}></i>
                                    {sidebarOpen && tab.label}
                                    {sidebarOpen && tab.badge !== undefined && (
                                        <span className="badge ms-auto" style={{ background: isActive ? '#4a9eff' : tab.color }}>{tab.badge}</span>
                                    )}
                                </button>
                            );
                        })}

                        <hr className="my-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                        <button className={`nav-link border-0 bg-transparent py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                            onClick={() => setShowLogout(true)}
                            onMouseEnter={() => setHoveredTab("logout")} onMouseLeave={() => setHoveredTab(null)}
                            title={!sidebarOpen ? "Logout" : undefined}
                            style={{ ...sidebarStyles.navItem, color: hoveredTab === "logout" ? "#ff6b6b" : "white", ...(hoveredTab === "logout" ? sidebarStyles.logoutHover : {}) }}>
                            <i className={`bi bi-box-arrow-right ${sidebarOpen ? "me-2" : ""}`} style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transition: "transform 0.2s", transform: hoveredTab === "logout" ? "scale(1.2)" : "scale(1)" }}></i>
                            {sidebarOpen && "Logout"}
                        </button>
                    </nav>
                </div>
            </div>

            {/* ─── Main Content ──────────────────────────────────────────────── */}
            <div className="flex-grow-1" style={{ marginLeft: sidebarOpen ? "280px" : "70px", transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)", padding: "1.5rem 2rem" }}>

                {/* Top Bar */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="fw-bold mb-0" style={{ color: "#1a1e2b" }}>
                            {activeTab === "dashboard" && <><i className="bi bi-speedometer2 me-2" style={{ color: '#4a9eff' }}></i>Trainer Overview</>}
                            {activeTab === "batchProgress" && <><i className="bi bi-bar-chart-line me-2" style={{ color: '#28a745' }}></i>Batch Progress</>}
                            {activeTab === "myBatches" && <><i className="bi bi-grid me-2" style={{ color: '#fd7e14' }}></i>My Batches</>}
                        </h4>
                        <p className="text-muted small mb-0 mt-1">Welcome back, <strong>{currentUser.name}</strong> 👋</p>
                    </div>
                    {(activeTab === "batchProgress" || activeTab === "dashboard") && (
                        <button className="btn text-white px-4 py-2 d-flex align-items-center gap-2"
                            style={{ background: 'linear-gradient(135deg,#4a9eff,#1a6fc4)', border: 'none', borderRadius: '10px', boxShadow: '0 4px 15px rgba(74,158,255,0.3)' }}
                            onClick={() => { setEditingProgress(null); setShowProgressModal(true); }}
                            disabled={batches.length === 0}>
                            <i className="bi bi-plus-lg"></i>Add Batch Progress
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                        <div className="text-center">
                            <div className="spinner-border mb-3" style={{ color: '#4a9eff', width: '3rem', height: '3rem' }}></div>
                            <p className="text-muted">Loading your dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ─── Dashboard Tab ─────────────────────────────────────── */}
                        {activeTab === "dashboard" && (
                            <>
                                {/* Stat Cards */}
                                <div className="row g-4 mb-4">
                                    {[
                                        { label: "My Batches", value: stats.myBatches, icon: "bi-grid-fill", gradient: "linear-gradient(135deg,#4a9eff,#1a6fc4)", action: () => setActiveTab("myBatches") },
                                        { label: "Total Progress Records", value: stats.totalProgress, icon: "bi-bar-chart-fill", gradient: "linear-gradient(135deg,#28a745,#19692c)", action: () => setActiveTab("batchProgress") },
                                        { label: "This Month", value: stats.thisMonth, icon: "bi-calendar-check-fill", gradient: "linear-gradient(135deg,#fd7e14,#c8590a)", action: null },
                                        { label: "With Documents", value: stats.withDocs, icon: "bi-file-earmark-check-fill", gradient: "linear-gradient(135deg,#6f42c1,#4a2a8a)", action: null },
                                    ].map((card, i) => (
                                        <div className="col-md-3" key={i}>
                                            <div className="card border-0 shadow stat-card h-100" onClick={card.action || undefined} style={{ borderRadius: "14px", background: card.gradient, color: "white", cursor: card.action ? 'pointer' : 'default' }}>
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <p className="mb-2" style={{ opacity: 0.8, fontSize: '0.85rem' }}>{card.label}</p>
                                                            <h2 className="fw-bold mb-0">{card.value}</h2>
                                                        </div>
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)' }}>
                                                            <i className={`bi ${card.icon} fs-4`}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Actions */}
                                <div className="row g-4 mb-4">
                                    {[
                                        { label: "Add Batch Progress", icon: "bi-plus-circle-fill", color: "#28a745", desc: "Record new batch progress", action: () => { setEditingProgress(null); setShowProgressModal(true); } },
                                        { label: "View Progress Records", icon: "bi-bar-chart-line-fill", color: "#4a9eff", desc: "See all progress entries", action: () => setActiveTab("batchProgress") },
                                        { label: "My Batches", icon: "bi-grid-fill", color: "#fd7e14", desc: "View assigned batches", action: () => setActiveTab("myBatches") },
                                    ].map((item, idx) => (
                                        <div className="col-md-4" key={idx}>
                                            <div className="card border-0 shadow-sm h-100" onClick={item.action}
                                                style={{ borderRadius: '14px', background: 'white', cursor: 'pointer', borderTop: `3px solid ${item.color}` }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                                                <div className="card-body text-center p-4" style={{ transition: 'all 0.25s' }}>
                                                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '56px', height: '56px', background: `${item.color}20` }}>
                                                        <i className={`bi ${item.icon}`} style={{ fontSize: '1.5rem', color: item.color }}></i>
                                                    </div>
                                                    <h6 className="fw-bold mb-1" style={{ color: '#1a1e2b' }}>{item.label}</h6>
                                                    <p className="text-muted small mb-0">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Progress Table */}
                                <div className="card border-0 shadow" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                    <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                                        <h6 className="fw-bold mb-0"><i className="bi bi-clock-history me-2" style={{ color: '#4a9eff' }}></i>Recent Progress Records</h6>
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setActiveTab("batchProgress")}>View All</button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead style={{ background: '#f8f9fa' }}>
                                                <tr>
                                                    <th className="py-3 ps-4 fw-semibold text-muted" style={{ fontSize: '0.82rem' }}>TITLE</th>
                                                    <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.82rem' }}>BATCH</th>
                                                    <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.82rem' }}>DATE</th>
                                                    <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.82rem' }}>DOCUMENT</th>
                                                    <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.82rem' }}>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {batchProgress.slice(0, 5).map(p => (
                                                    <tr key={p.id} className="align-middle">
                                                        <td className="py-3 ps-4 fw-semibold">{p.title}</td>
                                                        <td className="py-3"><span className="badge" style={{ background: '#e6f0ff', color: '#1a6fc4' }}>{getBatchName(p.batchId)}</span></td>
                                                        <td className="py-3 text-muted small">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                                        <td className="py-3">{p.documentName ? <span className="badge bg-success"><i className="bi bi-paperclip me-1"></i>{p.documentName.length > 18 ? p.documentName.substring(0, 18) + '…' : p.documentName}</span> : <span className="text-muted small">—</span>}</td>
                                                        <td className="py-3">
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setViewingProgress(p); setShowViewModal(true); }}><i className="bi bi-eye-fill"></i></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {batchProgress.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted"><i className="bi bi-bar-chart-line fs-1 d-block mb-2"></i>No progress records yet. Click "Add Batch Progress" to get started.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ─── Batch Progress Tab ─────────────────────────────────── */}
                        {activeTab === "batchProgress" && (
                            <>
                                {/* Filter row */}
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                                    <div className="card-body py-3 px-4">
                                        <div className="d-flex flex-wrap gap-2 align-items-center">
                                            <span className="text-muted small fw-semibold me-2">Filter by Batch:</span>
                                            <button className={`btn btn-sm px-3 rounded-pill ${progressFilter === 'all' ? 'text-white' : 'btn-outline-secondary'}`}
                                                style={progressFilter === 'all' ? { background: '#4a9eff', border: 'none' } : {}}
                                                onClick={() => setProgressFilter('all')}>All ({batchProgress.length})</button>
                                            {batches.map(b => (
                                                <button key={b.id} className={`btn btn-sm px-3 rounded-pill ${progressFilter === b.id ? 'text-white' : 'btn-outline-secondary'}`}
                                                    style={progressFilter === b.id ? { background: '#28a745', border: 'none' } : {}}
                                                    onClick={() => setProgressFilter(b.id)}>{b.batchName} ({batchProgress.filter(p => p.batchId === b.id).length})</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card border-0 shadow" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead style={{ background: '#1a1e2b', color: 'white' }}>
                                                <tr>
                                                    <th className="py-3 ps-4" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>#</th>
                                                    <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>TITLE</th>
                                                    <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>BATCH</th>
                                                    <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>DESCRIPTION</th>
                                                    <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>DOCUMENT</th>
                                                    <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>DATE</th>
                                                    <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProgress.map((p, idx) => (
                                                    <tr key={p.id} className="align-middle">
                                                        <td className="py-3 ps-4 text-muted fw-semibold">{idx + 1}</td>
                                                        <td className="py-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                                                                    <i className="bi bi-bar-chart-line-fill" style={{ color: '#4a9eff', fontSize: '0.9rem' }}></i>
                                                                </div>
                                                                <div>
                                                                    <span className="fw-semibold d-block" style={{ color: '#1a1e2b' }}>{p.title}</span>
                                                                    {p.updatedAt && <span className="badge bg-light text-muted" style={{ fontSize: '0.68rem' }}>Edited</span>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge px-3 py-2" style={{ background: '#e6f0ff', color: '#1a6fc4', fontWeight: 600 }}>{getBatchName(p.batchId)}</span>
                                                        </td>
                                                        <td className="py-3" style={{ maxWidth: '220px' }}>
                                                            <span className="text-muted small" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {p.description || <em>No description</em>}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            {p.documentName ? (
                                                                <a href={p.documentData} download={p.documentName} className="d-flex align-items-center gap-1 text-decoration-none" style={{ color: '#1a6fc4' }} title={p.documentName}>
                                                                    <i className="bi bi-file-earmark-arrow-down-fill fs-5"></i>
                                                                    <span className="small fw-semibold" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.documentName}</span>
                                                                </a>
                                                            ) : <span className="text-muted small">—</span>}
                                                        </td>
                                                        <td className="py-3 text-muted small">
                                                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="d-flex gap-1">
                                                                <button className="btn btn-sm" style={{ background: '#e6f0ff', color: '#1a6fc4', border: 'none', borderRadius: '8px', padding: '5px 10px' }} title="View" onClick={() => { setViewingProgress(p); setShowViewModal(true); }}>
                                                                    <i className="bi bi-eye-fill"></i>
                                                                </button>
                                                                <button className="btn btn-sm" style={{ background: '#fff3cd', color: '#856404', border: 'none', borderRadius: '8px', padding: '5px 10px' }} title="Edit" onClick={() => { setEditingProgress(p); setShowProgressModal(true); }}>
                                                                    <i className="bi bi-pencil-fill"></i>
                                                                </button>
                                                                <button className="btn btn-sm" style={{ background: '#ffe6e6', color: '#dc3545', border: 'none', borderRadius: '8px', padding: '5px 10px' }} title="Delete" onClick={() => { setDeletingProgress(p); setShowDeleteModal(true); }}>
                                                                    <i className="bi bi-trash-fill"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredProgress.length === 0 && (
                                                    <tr>
                                                        <td colSpan="7" className="text-center py-5">
                                                            <i className="bi bi-bar-chart-line fs-1 d-block mb-3" style={{ color: '#4a9eff', opacity: 0.5 }}></i>
                                                            <p className="fw-semibold text-muted mb-2">No Progress Records Yet</p>
                                                            <p className="text-muted small mb-3">Start documenting your batch progress to keep track of training milestones.</p>
                                                            {batches.length > 0 ? (
                                                                <button className="btn text-white px-4 py-2" style={{ background: 'linear-gradient(135deg,#4a9eff,#1a6fc4)', borderRadius: '10px', border: 'none' }}
                                                                    onClick={() => { setEditingProgress(null); setShowProgressModal(true); }}>
                                                                    <i className="bi bi-plus-lg me-2"></i>Add First Progress Record
                                                                </button>
                                                            ) : (
                                                                <div className="alert alert-warning d-inline-block"><i className="bi bi-exclamation-triangle me-2"></i>You are not assigned to any batch yet.</div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ─── My Batches Tab ─────────────────────────────────────── */}
                        {activeTab === "myBatches" && (
                            <div className="card border-0 shadow" style={{ borderRadius: '14px', overflow: 'hidden' }}>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead style={{ background: '#1a1e2b', color: 'white' }}>
                                            <tr>
                                                <th className="py-3 ps-4" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>#</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>BATCH</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>COURSE</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>MODE</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>START DATE</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>END DATE</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>STUDENTS</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>STATUS</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>PROGRESS</th>
                                                <th className="py-3" style={{ fontWeight: 600, fontSize: '0.83rem', letterSpacing: '0.04em' }}>ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {batches.map((batch, idx) => {
                                                const batchStudents = students.filter(s => s.batchId === batch.id || s.batch === batch.batchName);
                                                const progressCount = batchProgress.filter(p => p.batchId === batch.id).length;
                                                const statusColor = { Ongoing: '#28a745', Upcoming: '#4a9eff', Completed: '#6c757d' }[batch.status] || '#6c757d';
                                                const modeIcon = { Online: 'bi-camera-video', Offline: 'bi-building', Hybrid: 'bi-diagram-2' }[batch.mode] || 'bi-building';
                                                return (
                                                    <tr key={batch.id} className="align-middle">
                                                        <td className="py-3 ps-4 text-muted fw-semibold">{idx + 1}</td>
                                                        <td className="py-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', background: '#f0f7ff', flexShrink: 0 }}>
                                                                    <i className="bi bi-grid-fill" style={{ color: '#fd7e14', fontSize: '0.95rem' }}></i>
                                                                </div>
                                                                <span className="fw-bold" style={{ color: '#1a1e2b' }}>{batch.batchName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 fw-semibold">{batch.course || '—'}</td>
                                                        <td className="py-3">
                                                            <span className="badge" style={{ background: '#f0f0f0', color: '#555', fontWeight: 600 }}>
                                                                <i className={`bi ${modeIcon} me-1`}></i>{batch.mode || '—'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 small text-muted">{batch.startDate ? new Date(batch.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                                        <td className="py-3 small text-muted">{batch.endDate ? new Date(batch.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</td>
                                                        <td className="py-3">
                                                            <span className="badge" style={{ background: '#e6f0ff', color: '#1a6fc4', fontWeight: 600 }}>
                                                                <i className="bi bi-people-fill me-1"></i>{batchStudents.length}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge px-3 py-2" style={{ background: statusColor }}>{batch.status}</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge" style={{ background: progressCount > 0 ? '#d1e7dd' : '#f8f9fa', color: progressCount > 0 ? '#0f5132' : '#6c757d', fontWeight: 600 }}>
                                                                <i className="bi bi-bar-chart-line me-1"></i>{progressCount} record{progressCount !== 1 ? 's' : ''}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <button className="btn btn-sm text-white fw-semibold" style={{ background: 'linear-gradient(135deg,#4a9eff,#1a6fc4)', border: 'none', borderRadius: '8px', whiteSpace: 'nowrap' }}
                                                                onClick={() => { setEditingProgress(null); setShowProgressModal(true); }}>
                                                                <i className="bi bi-plus-lg me-1"></i>Add Progress
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {batches.length === 0 && (
                                                <tr>
                                                    <td colSpan="10" className="text-center py-5">
                                                        <i className="bi bi-grid fs-1 d-block mb-3" style={{ color: '#fd7e14', opacity: 0.5 }}></i>
                                                        <p className="fw-semibold text-muted mb-1">No Batches Assigned</p>
                                                        <p className="text-muted small">You have not been assigned to any batch yet. Please contact your admin.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─── Modals ───────────────────────────────────────────────────── */}
            <BatchProgressModal
                show={showProgressModal}
                onClose={() => { setShowProgressModal(false); setEditingProgress(null); }}
                onSave={handleSaveProgress}
                editing={editingProgress}
                myBatches={batches}
            />
            <ViewProgressModal
                show={showViewModal}
                onClose={() => { setShowViewModal(false); setViewingProgress(null); }}
                progress={viewingProgress}
                batchName={viewingProgress ? getBatchName(viewingProgress.batchId) : ''}
            />
            <DeleteModal
                show={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setDeletingProgress(null); }}
                onConfirm={confirmDelete}
                title={deletingProgress?.title}
            />
            <LogoutModal show={showLogout} onClose={() => setShowLogout(false)} onConfirm={confirmLogout} />
        </div>
    );
};

export default TrainerDashboard;
