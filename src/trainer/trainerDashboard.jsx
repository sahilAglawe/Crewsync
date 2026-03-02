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
    const [exiting, setExiting] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => { setExiting(true); setTimeout(onClose, 300); }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = { success: { bg: '#d1e7dd', border: '#28a745', text: '#0f5132', icon: '#28a745' }, error: { bg: '#f8d7da', border: '#dc3545', text: '#842029', icon: '#dc3545' }, warning: { bg: '#fff3cd', border: '#ffc107', text: '#664d03', icon: '#ffc107' }, info: { bg: '#cff4fc', border: '#0dcaf0', text: '#055160', icon: '#0dcaf0' } };
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
    const c = colors[toast.type] || colors.info;

    return (
        <div style={{ background: c.bg, borderLeft: `4px solid ${c.border}`, borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', color: c.text, animation: exiting ? 'toastSlideOut 0.3s ease forwards' : 'toastSlideIn 0.35s ease', minWidth: '300px' }}>
            <i className={`bi ${icons[toast.type]}`} style={{ fontSize: '1.3rem', color: c.icon }}></i>
            <span style={{ flex: 1, fontWeight: 500, fontSize: '0.92rem' }}>{toast.message}</span>
            <button onClick={() => { setExiting(true); setTimeout(onClose, 300); }} style={{ background: 'none', border: 'none', color: c.text, cursor: 'pointer', fontSize: '1.1rem', padding: 0, opacity: 0.6 }}>
                <i className="bi bi-x-lg"></i>
            </button>
            <style>{`
        @keyframes toastSlideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
      `}</style>
        </div>
    );
}

// ─── Add Task Modal ──────────────────────────────────────────────────
function AddTaskModal({ show, onClose, students, onAddTask, editingTask }) {
    const [taskData, setTaskData] = useState({ studentId: "", title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });

    useEffect(() => {
        if (editingTask) {
            setTaskData({ studentId: editingTask.studentId, title: editingTask.title, description: editingTask.description || "", dueDate: editingTask.dueDate || "", priority: editingTask.priority || "Medium", status: editingTask.status || "Pending" });
        } else {
            setTaskData({ studentId: "", title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });
        }
    }, [editingTask, show]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskData.studentId || !taskData.title) return;
        onAddTask(taskData);
        setTaskData({ studentId: "", title: "", description: "", dueDate: "", priority: "Medium", status: "Pending" });
    };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-header border-0 pb-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className={`bi ${editingTask ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{ color: '#4a9eff' }}></i>
                            {editingTask ? 'Edit Task' : 'Add New Task'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Select Student <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-person"></i></span>
                                        <select className="form-select" value={taskData.studentId} onChange={e => setTaskData({ ...taskData, studentId: e.target.value })} required>
                                            <option value="">-- Choose a student --</option>
                                            {students.map(s => (<option key={s.id} value={s.id}>{s.name} ({s.email})</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Task Title <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="bi bi-card-heading"></i></span>
                                        <input type="text" className="form-control" placeholder="Enter task title" value={taskData.title} onChange={e => setTaskData({ ...taskData, title: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Description</label>
                                    <textarea className="form-control" rows="3" placeholder="Describe the task..." value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Due Date</label>
                                    <input type="date" className="form-control" value={taskData.dueDate} onChange={e => setTaskData({ ...taskData, dueDate: e.target.value })} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Priority</label>
                                    <select className="form-select" value={taskData.priority} onChange={e => setTaskData({ ...taskData, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Status</label>
                                    <select className="form-select" value={taskData.status} onChange={e => setTaskData({ ...taskData, status: e.target.value })}>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-light px-4 py-2" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none' }}>
                                <i className={`bi ${editingTask ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                {editingTask ? 'Update Task' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ─── View Task Modal ─────────────────────────────────────────────────
function ViewTaskModal({ show, onClose, task, studentName }) {
    if (!show || !task) return null;
    const priorityColors = { High: '#dc3545', Medium: '#fd7e14', Low: '#28a745' };
    const statusColors = { Pending: '#6c757d', 'In Progress': '#4a9eff', Completed: '#28a745' };

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0" style={{ borderRadius: '15px' }}>
                    <div className="modal-header border-0" style={{ background: '#1a1e2b', borderRadius: '15px 15px 0 0' }}>
                        <h5 className="modal-title text-white fw-bold">
                            <i className="bi bi-clipboard-data me-2" style={{ color: '#4a9eff' }}></i>Task Details
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="text-center mb-4">
                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', background: '#e6f0ff' }}>
                                <i className="bi bi-clipboard-check" style={{ fontSize: '2rem', color: '#4a9eff' }}></i>
                            </div>
                            <h5 className="fw-bold mb-2">{task.title}</h5>
                            <div className="d-flex gap-2 justify-content-center">
                                <span className="badge px-3 py-2" style={{ background: priorityColors[task.priority] || '#6c757d' }}>{task.priority}</span>
                                <span className="badge px-3 py-2" style={{ background: statusColors[task.status] || '#6c757d' }}>{task.status}</span>
                            </div>
                        </div>
                        <div className="list-group list-group-flush">
                            <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                                <span className="text-muted"><i className="bi bi-person me-2"></i>Student</span>
                                <span className="fw-semibold">{studentName || 'N/A'}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                                <span className="text-muted"><i className="bi bi-calendar me-2"></i>Due Date</span>
                                <span className="fw-semibold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between px-0 border-0 py-2">
                                <span className="text-muted"><i className="bi bi-calendar-check me-2"></i>Created</span>
                                <span className="fw-semibold">{task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {task.description && (
                                <div className="list-group-item px-0 border-0 py-2">
                                    <span className="text-muted d-block mb-1"><i className="bi bi-text-paragraph me-2"></i>Description</span>
                                    <p className="mb-0 bg-light rounded p-3" style={{ fontSize: '0.9rem' }}>{task.description}</p>
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

// ─── Delete Confirmation Modal ───────────────────────────────────────
function DeleteConfirmationModal({ show, onClose, onConfirm, taskTitle }) {
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
                            <h5 className="fw-bold mb-2">Delete Task</h5>
                            <p className="text-muted mb-0">Are you sure you want to delete &quot;{taskTitle}&quot;? This cannot be undone.</p>
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

// ═════════════════════════════════════════════════════════════════════
// ─── Main TrainerDashboard Component ────────────────────────────────
// ═════════════════════════════════════════════════════════════════════
const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [students, setStudents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showViewTaskModal, setShowViewTaskModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [hoveredTab, setHoveredTab] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [toasts, setToasts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [taskFilter, setTaskFilter] = useState("All");

    const currentUser = {
        id: localStorage.getItem("userId"),
        name: localStorage.getItem("userName") || "Trainer",
        email: localStorage.getItem("userEmail") || "trainer@example.com",
        role: localStorage.getItem("role") || "TRAINER"
    };

    // ─── Toast helper ────────────────────────────────────────────────
    const showToast = useCallback((message, type = "success") => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // ─── Fetch data ──────────────────────────────────────────────────
    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/students`);
            setStudents(res.data);
        } catch (err) { console.error("Error fetching students:", err); }
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/tasks`);
            // Filter tasks by trainer
            const myTasks = res.data.filter(t => t.trainerId === currentUser.id);
            setTasks(myTasks);
        } catch (err) { console.error("Error fetching tasks:", err); setTasks([]); }
        finally { setLoading(false); }
    };

    const fetchBatches = async () => {
        try {
            const res = await axios.get(`${API_URL}/batches`);
            setBatches(res.data);
        } catch (err) { console.error("Error fetching batches:", err); }
    };

    useEffect(() => {
        fetchStudents();
        fetchTasks();
        fetchBatches();
    }, []);

    // ─── Stats ───────────────────────────────────────────────────────
    const stats = {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(t => t.status === "Pending").length,
        inProgressTasks: tasks.filter(t => t.status === "In Progress").length,
        completedTasks: tasks.filter(t => t.status === "Completed").length,
        totalStudents: students.length,
        highPriority: tasks.filter(t => t.priority === "High").length
    };

    // ─── Get student name helper ─────────────────────────────────────
    const getStudentName = (studentId) => {
        const s = students.find(st => st.id === studentId);
        return s ? s.name : "Unknown";
    };

    // ─── Filter tasks ────────────────────────────────────────────────
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getStudentName(task.studentId)?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = taskFilter === "All" || task.status === taskFilter;
        return matchesSearch && matchesFilter;
    });

    // ─── Add Task ────────────────────────────────────────────────────
    const handleAddTask = async (taskData) => {
        const student = students.find(s => s.id === taskData.studentId);
        const newTask = {
            ...taskData,
            id: Date.now().toString(),
            trainerId: currentUser.id,
            trainerName: currentUser.name,
            studentName: student?.name || "",
            createdAt: new Date().toISOString()
        };
        try {
            const res = await axios.post(`${API_URL}/tasks`, newTask);
            setTasks(prev => [...prev, res.data]);
            setShowAddTaskModal(false);
            showToast(`Task "${taskData.title}" assigned to ${student?.name} successfully!`, "success");
        } catch (err) {
            console.error("Error adding task:", err);
            showToast("Failed to add task. Please check if the server is running.", "error");
        }
    };

    // ─── Edit Task ───────────────────────────────────────────────────
    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowAddTaskModal(true);
    };

    const handleUpdateTask = async (taskData) => {
        const student = students.find(s => s.id === taskData.studentId);
        const updated = { ...editingTask, ...taskData, studentName: student?.name || "" };
        try {
            const res = await axios.put(`${API_URL}/tasks/${editingTask.id}`, updated);
            setTasks(prev => prev.map(t => t.id === editingTask.id ? res.data : t));
            setEditingTask(null);
            setShowAddTaskModal(false);
            showToast("Task updated successfully!", "success");
        } catch (err) {
            console.error("Error updating task:", err);
            showToast("Failed to update task.", "error");
        }
    };

    // ─── Delete Task ─────────────────────────────────────────────────
    const handleDeleteClick = (task) => { setTaskToDelete(task); setShowDeleteModal(true); };

    const confirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/tasks/${taskToDelete.id}`);
            setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
            setShowDeleteModal(false);
            setTaskToDelete(null);
            showToast("Task deleted successfully!", "success");
        } catch (err) {
            console.error("Error deleting task:", err);
            showToast("Failed to delete task.", "error");
        }
    };

    // ─── View Task ───────────────────────────────────────────────────
    const handleViewClick = (task) => { setSelectedTask(task); setShowViewTaskModal(true); };

    // ─── Logout ──────────────────────────────────────────────────────
    const handleLogoutClick = () => setShowLogoutModal(true);
    const confirmLogout = () => { setShowLogoutModal(false); localStorage.clear(); navigate("/login"); };

    // ─── Sidebar config ──────────────────────────────────────────────
    const sidebarStyles = {
        navItem: { transition: "all 0.3s ease-in-out", cursor: "pointer", position: "relative", overflow: "hidden" },
        navItemHover: { transform: "translateX(5px)", backgroundColor: "rgba(74,158,255,0.15)", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", borderLeft: "4px solid #4a9eff" },
        navItemActive: { background: "linear-gradient(90deg, rgba(74,158,255,0.25) 0%, rgba(74,158,255,0.08) 100%)", borderLeft: "4px solid #4a9eff", boxShadow: "0 4px 15px rgba(74,158,255,0.15)", color: "#4a9eff" },
        logoutHover: { background: "linear-gradient(90deg, rgba(255,107,107,0.18) 0%, rgba(255,107,107,0.05) 100%)", color: "#ff6b6b", transform: "translateX(5px)", borderLeft: "4px solid #ff6b6b" }
    };

    const sidebarTabs = [
        { key: "dashboard", label: "Dashboard", icon: "bi-speedometer2", badge: null, color: "#4a9eff" },
        { key: "tasks", label: "View Tasks", icon: "bi-clipboard-data", badge: tasks.length, color: "#28a745" },
        { key: "students", label: "My Students", icon: "bi-people", badge: students.length, color: "#fd7e14" }
    ];

    const priorityColors = { High: '#dc3545', Medium: '#fd7e14', Low: '#28a745' };
    const statusColors = { Pending: '#6c757d', 'In Progress': '#4a9eff', Completed: '#28a745' };

    // ═══════════════════════════════════════════════════════════════════
    // ─── RENDER ───────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════
    return (
        <div className="d-flex" style={{ minHeight: "100vh", background: "#f5f7fa" }}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

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

                    {/* Header */}
                    <div className="d-flex align-items-center mb-4" style={{ justifyContent: sidebarOpen ? "space-between" : "center" }}>
                        {sidebarOpen && <h4 className="fw-bold mb-0" style={{ color: "#4a9eff", whiteSpace: "nowrap" }}>CrewSync</h4>}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                            style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#4a9eff", width: "38px", height: "38px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", transition: "all 0.2s ease", flexShrink: 0 }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}>
                            <i className={`bi ${sidebarOpen ? "bi-chevron-left" : "bi-list"}`}></i>
                        </button>
                    </div>

                    {/* Profile */}
                    <div className={`${sidebarOpen ? "text-center" : "d-flex justify-content-center"} mb-4 p-2 rounded`}
                        style={{ transition: "all 0.3s ease", cursor: "default", background: hoveredTab === "profile" ? "rgba(255,255,255,0.05)" : "transparent" }}
                        onMouseEnter={() => setHoveredTab("profile")} onMouseLeave={() => setHoveredTab(null)}
                        title={!sidebarOpen ? `${currentUser.name} (Trainer)` : undefined}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                            style={{ width: sidebarOpen ? "80px" : "40px", height: sidebarOpen ? "80px" : "40px", background: "#2a2f3c", transition: "all 0.3s ease", transform: hoveredTab === "profile" ? "scale(1.05)" : "scale(1)", boxShadow: hoveredTab === "profile" ? "0 0 20px rgba(74,158,255,0.3)" : "none" }}>
                            <i className="bi bi-person-fill" style={{ fontSize: sidebarOpen ? "2.5rem" : "1.2rem", color: "#4a9eff" }}></i>
                        </div>
                        {sidebarOpen && (
                            <>
                                <h6 className="text-white mb-1 mt-3">{currentUser.name}</h6>
                                <p className="text-white-50 small mb-2">{currentUser.email}</p>
                                <span className="badge px-3 py-2" style={{ background: '#4a9eff' }}>Trainer</span>
                            </>
                        )}
                    </div>

                    {sidebarOpen && <p className="text-white-50 small mb-4">Task Management</p>}

                    <nav className="nav flex-column">
                        {sidebarTabs.map(tab => {
                            const isActive = activeTab === tab.key;
                            const isHovered = hoveredTab === tab.key;
                            const accentColor = isActive ? "#4a9eff" : (isHovered ? tab.color : "white");

                            return (
                                <button key={tab.key}
                                    className={`nav-link border-0 bg-transparent mb-2 py-2 rounded sidebar-tab ${sidebarOpen ? "text-start w-100 px-3" : "d-flex justify-content-center w-100 px-0"}`}
                                    onClick={() => setActiveTab(tab.key)}
                                    onMouseEnter={() => setHoveredTab(tab.key)} onMouseLeave={() => setHoveredTab(null)}
                                    title={!sidebarOpen ? tab.label : undefined}
                                    style={{
                                        ...sidebarStyles.navItem, color: accentColor,
                                        ...(isActive ? sidebarStyles.navItemActive : {}),
                                        ...(isHovered && !isActive ? { ...sidebarStyles.navItemHover, borderLeftColor: tab.color, background: `linear-gradient(90deg, ${tab.color}22 0%, transparent 100%)` } : {})
                                    }}>
                                    <i className={`bi ${tab.icon} ${sidebarOpen ? "me-2" : ""}`}
                                        style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transition: "all 0.25s ease", transform: isHovered ? "scale(1.2)" : "scale(1)", color: accentColor, filter: isHovered && !isActive ? `drop-shadow(0 0 4px ${tab.color}88)` : "none" }}></i>
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
                            onMouseEnter={() => setHoveredTab("logout")} onMouseLeave={() => setHoveredTab(null)}
                            title={!sidebarOpen ? "Logout" : undefined}
                            style={{ ...sidebarStyles.navItem, color: hoveredTab === "logout" ? "#ff6b6b" : "white", ...(hoveredTab === "logout" ? sidebarStyles.logoutHover : {}) }}>
                            <i className={`bi bi-box-arrow-right ${sidebarOpen ? "me-2" : ""}`}
                                style={{ fontSize: sidebarOpen ? undefined : "1.2rem", transition: "all 0.25s ease", transform: hoveredTab === "logout" ? "scale(1.2)" : "scale(1)" }}></i>
                            {sidebarOpen && "Logout"}
                        </button>
                    </nav>
                </div>
            </div>

            {/* ─── Main Content ──────────────────────────────────────────── */}
            <div className="flex-grow-1 p-4" style={{ marginLeft: sidebarOpen ? "280px" : "70px", transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold" style={{ color: "#1a1e2b" }}>
                        {activeTab === "dashboard" && <><i className="bi bi-speedometer2 me-2" style={{ color: '#4a9eff' }}></i>Trainer Overview</>}
                        {activeTab === "tasks" && <><i className="bi bi-clipboard-data me-2" style={{ color: '#4a9eff' }}></i>All Tasks</>}
                        {activeTab === "students" && <><i className="bi bi-people me-2" style={{ color: '#4a9eff' }}></i>My Students</>}
                    </h4>
                    {(activeTab === "dashboard" || activeTab === "tasks") && (
                        <button className="btn text-white px-4 py-2" style={{ background: '#4a9eff', border: 'none', borderRadius: '10px' }}
                            onClick={() => { setEditingTask(null); setShowAddTaskModal(true); }}>
                            <i className="bi bi-plus-lg me-2"></i>Add Task
                        </button>
                    )}
                </div>

                {/* ─── Dashboard Tab ──────────────────────────────────────── */}
                {activeTab === "dashboard" && (
                    <>
                        {/* Stats Cards */}
                        <div className="row g-4 mb-4">
                            {[
                                { label: "Total Tasks", value: stats.totalTasks, icon: "bi-clipboard-data-fill", bg: "#4a9eff" },
                                { label: "Pending", value: stats.pendingTasks, icon: "bi-clock-fill", bg: "#6c757d" },
                                { label: "In Progress", value: stats.inProgressTasks, icon: "bi-arrow-repeat", bg: "#fd7e14" },
                                { label: "Completed", value: stats.completedTasks, icon: "bi-check-circle-fill", bg: "#28a745" }
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

                        {/* Row 2 */}
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <div className="card p-3 border-0 shadow h-100" style={{ background: "#EC4899", borderRadius: "12px", color: "white" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div><h6 className="text-white-50 mb-2">Total Students</h6><h3 className="fw-bold mb-0">{stats.totalStudents}</h3></div>
                                        <i className="bi bi-people-fill fs-1 text-white-50"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card p-3 border-0 shadow h-100" style={{ background: "#dc3545", borderRadius: "12px", color: "white" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div><h6 className="text-white-50 mb-2">High Priority Tasks</h6><h3 className="fw-bold mb-0">{stats.highPriority}</h3></div>
                                        <i className="bi bi-exclamation-triangle-fill fs-1 text-white-50"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="row g-4 mb-4">
                            {[
                                { label: "Add New Task", icon: "bi-plus-circle-fill", bg: "#4a9eff", action: () => { setEditingTask(null); setShowAddTaskModal(true); } },
                                { label: "View All Tasks", icon: "bi-clipboard-data-fill", bg: "#28a745", action: () => setActiveTab("tasks") },
                                { label: "My Students", icon: "bi-people-fill", bg: "#fd7e14", action: () => setActiveTab("students") }
                            ].map((item, idx) => (
                                <div className="col-md-4" key={idx}>
                                    <div className="card border-0 shadow h-100" onClick={item.action}
                                        style={{ borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.25s ease' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                                        <div className="card-body text-center p-4">
                                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px', background: item.bg }}>
                                                <i className={`bi ${item.icon} text-white`} style={{ fontSize: '1.3rem' }}></i>
                                            </div>
                                            <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem', color: '#1a1e2b' }}>{item.label}</h6>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Tasks Table */}
                        <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="card-header bg-white border-0 py-3 px-4">
                                <h5 className="fw-bold mb-0"><i className="bi bi-clock-history me-2" style={{ color: '#4a9eff' }}></i>Recent Tasks</h5>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead style={{ background: '#f8f9fa' }}>
                                        <tr>
                                            <th className="py-3 ps-4 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Task</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Student</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Priority</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Status</th>
                                            <th className="py-3 fw-semibold text-muted" style={{ fontSize: '0.85rem' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.slice(0, 5).map(task => (
                                            <tr key={task.id} className="align-middle">
                                                <td className="py-3 ps-4 fw-semibold">{task.title}</td>
                                                <td className="py-3">{getStudentName(task.studentId)}</td>
                                                <td className="py-3"><span className="badge" style={{ background: priorityColors[task.priority] }}>{task.priority}</span></td>
                                                <td className="py-3"><span className="badge" style={{ background: statusColors[task.status] }}>{task.status}</span></td>
                                                <td className="py-3">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleViewClick(task)}><i className="bi bi-eye"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {tasks.length === 0 && (
                                            <tr><td colSpan="5" className="text-center py-4 text-muted">No tasks created yet. Click "Add Task" to get started.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ─── Tasks Tab ──────────────────────────────────────────── */}
                {activeTab === "tasks" && (
                    <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        {/* Search & Filter Bar */}
                        <div className="card-header bg-white border-0 py-3 px-4">
                            <div className="row g-2 align-items-center">
                                <div className="col-md-6">
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                                        <input type="text" className="form-control border-0 bg-light" placeholder="Search tasks or students..."
                                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex gap-2 justify-content-end">
                                    {["All", "Pending", "In Progress", "Completed"].map(f => (
                                        <button key={f} className={`btn btn-sm px-3 py-1 ${taskFilter === f ? 'text-white' : 'btn-outline-secondary'}`}
                                            style={taskFilter === f ? { background: '#4a9eff', border: 'none', borderRadius: '20px' } : { borderRadius: '20px' }}
                                            onClick={() => setTaskFilter(f)}>{f}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" style={{ color: '#4a9eff' }} role="status"><span className="visually-hidden">Loading...</span></div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead style={{ background: "#1a1e2b", color: "white" }}>
                                        <tr>
                                            <th className="py-3 ps-4">#</th>
                                            <th className="py-3">Task Title</th>
                                            <th className="py-3">Student</th>
                                            <th className="py-3">Due Date</th>
                                            <th className="py-3">Priority</th>
                                            <th className="py-3">Status</th>
                                            <th className="py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTasks.map((task, idx) => (
                                            <tr key={task.id} className="align-middle">
                                                <td className="py-3 ps-4 text-muted">{idx + 1}</td>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                            style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                                                            <i className="bi bi-clipboard-check" style={{ color: '#4a9eff', fontSize: '0.9rem' }}></i>
                                                        </div>
                                                        <span className="fw-semibold">{task.title}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">{getStudentName(task.studentId)}</td>
                                                <td className="py-3"><small>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</small></td>
                                                <td className="py-3"><span className="badge" style={{ background: priorityColors[task.priority] }}>{task.priority}</span></td>
                                                <td className="py-3"><span className="badge" style={{ background: statusColors[task.status] }}>{task.status}</span></td>
                                                <td className="py-3">
                                                    <button className="btn btn-sm btn-info text-white me-1" style={{ borderRadius: '8px' }} onClick={() => handleViewClick(task)}><i className="bi bi-eye-fill"></i></button>
                                                    <button className="btn btn-sm btn-warning text-white me-1" style={{ borderRadius: '8px' }} onClick={() => handleEditClick(task)}><i className="bi bi-pencil-fill"></i></button>
                                                    <button className="btn btn-sm btn-danger text-white" style={{ borderRadius: '8px' }} onClick={() => handleDeleteClick(task)}><i className="bi bi-trash-fill"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTasks.length === 0 && (
                                            <tr><td colSpan="7" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-3"></i>No tasks found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── Students Tab ───────────────────────────────────────── */}
                {activeTab === "students" && (
                    <div className="card border-0 shadow" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead style={{ background: "#1a1e2b", color: "white" }}>
                                    <tr>
                                        <th className="py-3 ps-4">#</th>
                                        <th className="py-3">Name</th>
                                        <th className="py-3">Email</th>
                                        <th className="py-3">Phone</th>
                                        <th className="py-3">Course</th>
                                        <th className="py-3">Batch</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s, idx) => (
                                        <tr key={s.id} className="align-middle">
                                            <td className="py-3 ps-4 text-muted">{idx + 1}</td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                        style={{ width: '34px', height: '34px', background: '#e6f0ff', flexShrink: 0 }}>
                                                        <i className="bi bi-person-fill" style={{ color: '#4a9eff', fontSize: '0.9rem' }}></i>
                                                    </div>
                                                    <span className="fw-semibold">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3">{s.email}</td>
                                            <td className="py-3">{s.phone || '—'}</td>
                                            <td className="py-3">{s.course || '—'}</td>
                                            <td className="py-3">
                                                <span className="badge" style={{ background: '#e6f0ff', color: '#4a9eff' }}>{s.batch || 'Not Assigned'}</span>
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge ${s.status === "Active" ? "bg-success" : "bg-secondary"}`}>{s.status}</span>
                                            </td>
                                            <td className="py-3">
                                                <button className="btn btn-sm text-white px-3" style={{ background: '#4a9eff', border: 'none', borderRadius: '8px' }}
                                                    onClick={() => { setEditingTask(null); setShowAddTaskModal(true); }}>
                                                    <i className="bi bi-plus-lg me-1"></i>Add Task
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr><td colSpan="8" className="text-center py-5 text-muted"><i className="bi bi-inbox fs-1 d-block mb-3"></i>No students found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Modals ────────────────────────────────────────────────── */}
            <AddTaskModal show={showAddTaskModal} onClose={() => { setShowAddTaskModal(false); setEditingTask(null); }}
                students={students} editingTask={editingTask}
                onAddTask={editingTask ? handleUpdateTask : handleAddTask} />
            <ViewTaskModal show={showViewTaskModal} onClose={() => setShowViewTaskModal(false)}
                task={selectedTask} studentName={selectedTask ? getStudentName(selectedTask.studentId) : ""} />
            <DeleteConfirmationModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete} taskTitle={taskToDelete?.title} />
            <LogoutConfirmationModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
        </div>
    );
};

export default TrainerDashboard;
