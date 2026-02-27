// counsellorDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

const CounsellorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAssignBatchModal, setShowAssignBatchModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
    status: "Active",
    attendance: 0
  });

  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch students and batches from API
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      // If endpoint doesn't exist, use sample data
      setStudents(sampleStudents);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/batches`);
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      // If endpoint doesn't exist, use sample data
      setBatches(sampleBatches);
    }
  };

  // Sample data for demonstration
  const sampleStudents = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      course: "Computer Science",
      batch: "CS-2024-A",
      enrollmentDate: "2024-01-15",
      status: "Active",
      attendance: 85
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      course: "Business Administration",
      batch: "BA-2024-B",
      enrollmentDate: "2024-01-10",
      status: "Active",
      attendance: 92
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567892",
      course: "Data Science",
      batch: "DS-2024-A",
      enrollmentDate: "2024-01-05",
      status: "Active",
      attendance: 78
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+1234567893",
      course: "Psychology",
      batch: "PSY-2024-A",
      enrollmentDate: "2024-01-20",
      status: "Inactive",
      attendance: 45
    }
  ];

  const sampleBatches = [
    {
      id: "1",
      name: "CS-2024-A",
      course: "Computer Science",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      studentsCount: 25,
      maxStudents: 30,
      status: "Ongoing"
    },
    {
      id: "2",
      name: "BA-2024-B",
      course: "Business Administration",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      studentsCount: 18,
      maxStudents: 25,
      status: "Ongoing"
    },
    {
      id: "3",
      name: "DS-2024-A",
      course: "Data Science",
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      studentsCount: 12,
      maxStudents: 20,
      status: "Upcoming"
    }
  ];

  useEffect(() => {
    fetchStudents();
    fetchBatches();
  }, []);

  // Stats calculations
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === "Active").length,
    totalBatches: batches.length,
    ongoingBatches: batches.filter(b => b.status === "Ongoing").length,
    avgAttendance: students.length > 0 
      ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 0), 0) / students.length)
      : 0
  };

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add Student
  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.course) {
      alert("Please fill all required fields");
      return;
    }

    const studentData = {
      ...newStudent,
      id: Date.now().toString(),
      enrollmentDate: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post(`${API_URL}/students`, studentData);
      setStudents([...students, response.data]);
      resetForm();
      setShowAddStudentModal(false);
    } catch (error) {
      console.error("Error adding student:", error);
      // If API fails, add to local state
      setStudents([...students, studentData]);
      resetForm();
      setShowAddStudentModal(false);
    }
  };

  // Edit Student
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setNewStudent(student);
    setShowAddStudentModal(true);
  };

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
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Delete Student
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
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // View Student Details
  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  // Assign Batch
  const handleAssignBatch = async (studentId, batchName, course) => {
    try {
      const updatedStudent = { ...students.find(s => s.id === studentId), batch: batchName, course };
      await axios.put(`${API_URL}/students/${studentId}`, updatedStudent);
      const updatedStudents = students.map(student =>
        student.id === studentId ? updatedStudent : student
      );
      setStudents(updatedStudents);
      setShowAssignBatchModal(false);
    } catch (error) {
      console.error("Error assigning batch:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewStudent({
      name: "",
      email: "",
      phone: "",
      course: "",
      batch: "",
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: "Active",
      attendance: 0
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
    logoutHover: {
      backgroundColor: "rgba(255, 107, 107, 0.15)",
      color: "#ff6b6b",
      transform: "translateX(5px)"
    }
  };

  // View Modal Component
  const ViewStudentModal = () => {
    if (!selectedStudent) return null;

    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowViewModal(false)}>
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-person-badge me-2"></i>
                Student Details
              </h5>
              <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row g-4">
                {/* Student Header */}
                <div className="col-12 text-center mb-2">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                    <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="fw-bold mb-1">{selectedStudent.name}</h4>
                  <span className={`badge ${selectedStudent.status === "Active" ? "bg-success" : "bg-danger"} px-3 py-2`}>
                    {selectedStudent.status}
                  </span>
                </div>

                {/* Personal Information */}
                <div className="col-md-6">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-info-circle me-2"></i>Personal Info</h6>
                      <div className="mb-2"><span className="text-muted">Email:</span> {selectedStudent.email}</div>
                      <div className="mb-2"><span className="text-muted">Phone:</span> {selectedStudent.phone}</div>
                      <div><span className="text-muted">Enrollment:</span> {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="col-md-6">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-book me-2"></i>Academic Info</h6>
                      <div className="mb-2"><span className="text-muted">Course:</span> {selectedStudent.course}</div>
                      <div className="mb-2"><span className="text-muted">Batch:</span> {selectedStudent.batch}</div>
                      <div><span className="text-muted">Attendance:</span> 
                        <span className={`ms-2 fw-semibold ${selectedStudent.attendance >= 75 ? 'text-success' : selectedStudent.attendance >= 50 ? 'text-warning' : 'text-danger'}`}>
                          {selectedStudent.attendance}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Progress */}
                <div className="col-12">
                  <div className="card bg-light border-0" style={{ borderRadius: '15px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3"><i className="bi bi-graph-up me-2"></i>Attendance Overview</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Current Attendance</span>
                        <span className="fw-semibold">{selectedStudent.attendance}%</span>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div 
                          className={`progress-bar ${selectedStudent.attendance >= 75 ? 'bg-success' : selectedStudent.attendance >= 50 ? 'bg-warning' : 'bg-danger'}`}
                          style={{ width: `${selectedStudent.attendance}%` }}
                        ></div>
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
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStudent(selectedStudent);
                  setShowAssignBatchModal(true);
                }}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Assign New Batch
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
              <h5 className="fw-bold mb-2">Delete Student</h5>
              <p className="text-muted mb-0">
                Are you sure you want to delete "{studentToDelete?.name}"? This action cannot be undone.
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

  // Add Student Modal
  const AddStudentModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => {
      setShowAddStudentModal(false);
      setEditingStudent(null);
      resetForm();
    }}>
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
          <div className="modal-header border-0 bg-light">
            <h5 className="modal-title fw-bold">
              <i className={`bi ${editingStudent ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h5>
            <button type="button" className="btn-close" onClick={() => {
              setShowAddStudentModal(false);
              setEditingStudent(null);
              resetForm();
            }}></button>
          </div>
          <div className="modal-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input 
                    className="form-control border-0 bg-light"
                    placeholder="Full Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    style={{ borderRadius: '10px' }}
                    required
                  />
                  <label>Full Name *</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input 
                    className="form-control border-0 bg-light"
                    type="email"
                    placeholder="Email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    style={{ borderRadius: '10px' }}
                    required
                  />
                  <label>Email *</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input 
                    className="form-control border-0 bg-light"
                    placeholder="Phone"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    style={{ borderRadius: '10px' }}
                  />
                  <label>Phone</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select 
                    className="form-control border-0 bg-light"
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                    style={{ borderRadius: '10px' }}
                    required
                  >
                    <option value="">Select Course</option>
                    {[...new Set(batches.map(b => b.course))].map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  <label>Course *</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select 
                    className="form-control border-0 bg-light"
                    value={newStudent.batch}
                    onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.name}>{batch.name}</option>
                    ))}
                  </select>
                  <label>Batch</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select 
                    className="form-control border-0 bg-light"
                    value={newStudent.status}
                    onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <label>Status</label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 bg-light">
            <button 
              type="button" 
              className="btn btn-light px-4 py-2"
              onClick={() => {
                setShowAddStudentModal(false);
                setEditingStudent(null);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary px-4 py-2"
              onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
            >
              <i className={`bi ${editingStudent ? 'bi-check-circle' : 'bi-person-plus'} me-2`}></i>
              {editingStudent ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Assign Batch Modal
  const AssignBatchModal = () => {
    const [selectedStudentId, setSelectedStudentId] = useState(selectedStudent?.id || '');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    return (
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => {
        setShowAssignBatchModal(false);
        setSelectedStudent(null);
      }}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-arrow-repeat me-2"></i>
                Assign Batch to Student
              </h5>
              <button type="button" className="btn-close" onClick={() => {
                setShowAssignBatchModal(false);
                setSelectedStudent(null);
              }}></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Student</label>
                <select 
                  className="form-select border-0 bg-light py-3"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">Choose student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.course || 'No Course'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Select Batch</label>
                <select 
                  className="form-select border-0 bg-light py-3"
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    const batch = batches.find(b => b.name === e.target.value);
                    if (batch) setSelectedCourse(batch.course);
                  }}
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">Choose batch...</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.name}>
                      {batch.name} - {batch.course} ({batch.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedBatch && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Course</label>
                  <input 
                    type="text" 
                    className="form-control border-0 bg-light py-3"
                    value={selectedCourse}
                    readOnly
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer border-0 bg-light">
              <button 
                type="button" 
                className="btn btn-light px-4 py-2"
                onClick={() => {
                  setShowAssignBatchModal(false);
                  setSelectedStudent(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary px-4 py-2"
                onClick={() => {
                  if (selectedStudentId && selectedBatch) {
                    handleAssignBatch(selectedStudentId, selectedBatch, selectedCourse);
                  } else {
                    alert('Please select both student and batch');
                  }
                }}
              >
                <i className="bi bi-check-circle me-2"></i>
                Assign Batch
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
      
      {/* Enhanced Sidebar with dark theme */}
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
          
          {/* User Profile Section */}
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
            <span className="badge bg-info px-3 py-2">Counsellor</span>
          </div>

          <p className="text-white-50 small mb-4">Student Management</p>

          <nav className="nav flex-column">
            {/* Students Tab */}
            <button 
              className={`nav-link text-white text-start w-100 border-0 bg-transparent mb-2 py-2 px-3 rounded`}
              onClick={() => setActiveTab("students")}
              onMouseEnter={() => setHoveredTab("students")}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                ...sidebarStyles.navItem,
                ...(activeTab === "students" ? sidebarStyles.navItemActive : {}),
                ...(hoveredTab === "students" && activeTab !== "students" ? sidebarStyles.navItemHover : {})
              }}
            >
              <i 
                className="bi bi-people me-2" 
                style={{ 
                  transition: "transform 0.2s ease",
                  transform: hoveredTab === "students" ? "scale(1.1)" : "scale(1)"
                }}
              ></i>
              Students
              {hoveredTab === "students" && (
                <span className="position-absolute end-0 me-3" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>

            {/* Batches Tab */}
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
              Batches
              {hoveredTab === "batches" && (
                <span className="position-absolute end-0 me-3" style={{ fontSize: "0.8rem" }}>
                  <i className="bi bi-arrow-right"></i>
                </span>
              )}
            </button>

            <hr className="my-4 bg-white-50" />
            
            {/* Logout button */}
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
        
        {/* Header with actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold" style={{ color: "#0d1b2a" }}>
            {activeTab === "students" ? (
              <><i className="bi bi-people me-2"></i>Student Management</>
            ) : (
              <><i className="bi bi-collection me-2"></i>Batch Management</>
            )}
          </h4>
          {activeTab === "students" && (
            <div className="d-flex gap-2">
              <div className="input-group" style={{ width: "300px" }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary d-flex align-items-center"
                onClick={() => setShowAddStudentModal(true)}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add Student
              </button>
              <button 
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={() => setShowAssignBatchModal(true)}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Assign Batch
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          {/* Total Students */}
          <div className="col-md-3">
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
                  <h6 className="text-white-50 mb-2">Total Students</h6>
                  <h3 className="fw-bold mb-0">{stats.totalStudents}</h3>
                </div>
                <i className="bi bi-people-fill fs-1 text-white-50"></i>
              </div>
            </div>
          </div>

          {/* Active Students */}
          <div className="col-md-3">
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
                  <h6 className="text-white-50 mb-2">Active Students</h6>
                  <h3 className="fw-bold mb-0">{stats.activeStudents}</h3>
                </div>
                <i className="bi bi-check-circle-fill fs-1 text-white-50"></i>
              </div>
            </div>
          </div>

          {/* Total Batches */}
          <div className="col-md-3">
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
                  <h6 className="text-white-50 mb-2">Total Batches</h6>
                  <h3 className="fw-bold mb-0">{stats.totalBatches}</h3>
                </div>
                <i className="bi bi-collection-fill fs-1 text-white-50"></i>
              </div>
            </div>
          </div>

          {/* Avg Attendance */}
          <div className="col-md-3">
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
                  <h6 className="text-white-50 mb-2">Avg Attendance</h6>
                  <h3 className="fw-bold mb-0">{stats.avgAttendance}%</h3>
                </div>
                <i className="bi bi-graph-up-arrow fs-1 text-white-50"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        {activeTab === "students" && (
          <div className="card border-0 shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#0d1b2a", color: "white" }}>
                    <tr>
                      <th className="py-3 ps-4">Student</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3">Course</th>
                      <th className="py-3">Batch</th>
                      <th className="py-3">Enrollment</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Attendance</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id} className="align-middle">
                        <td className="py-3 ps-4">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2"
                              style={{ width: "35px", height: "35px" }}
                            >
                              <i className="bi bi-person-circle text-primary"></i>
                            </div>
                            <div>
                              <div className="fw-semibold">{student.name}</div>
                              <small className="text-muted">{student.email}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">{student.phone}</td>
                        <td className="py-3">{student.course}</td>
                        <td className="py-3">
                          <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                            {student.batch}
                          </span>
                        </td>
                        <td className="py-3">{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`badge ${student.status === "Active" ? "bg-success" : "bg-danger"} px-3 py-2`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress" style={{ width: "60px", height: "5px" }}>
                              <div 
                                className={`progress-bar ${student.attendance >= 75 ? 'bg-success' : student.attendance >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                style={{ width: `${student.attendance}%` }}
                              ></div>
                            </div>
                            <span className="small">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <button 
                            className="btn btn-sm btn-info text-white me-2"
                            onClick={() => handleViewClick(student)}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-warning text-white me-2"
                            onClick={() => handleEditClick(student)}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger text-white"
                            onClick={() => handleDeleteClick(student)}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                          No students found. Click "Add Student" to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Batches Table */}
        {activeTab === "batches" && (
          <div className="card border-0 shadow-lg" style={{ borderRadius: "15px", overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: "#0d1b2a", color: "white" }}>
                  <tr>
                    <th className="py-3 ps-4">Batch Name</th>
                    <th className="py-3">Course</th>
                    <th className="py-3">Duration</th>
                    <th className="py-3">Students</th>
                    <th className="py-3">Capacity</th>
                    <th className="py-3">Status</th>
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
                          <span className="fw-semibold">{batch.name}</span>
                        </div>
                      </td>
                      <td className="py-3">{batch.course}</td>
                      <td className="py-3">
                        <small>
                          {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td className="py-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                          {batch.studentsCount || 0} Students
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress" style={{ width: "80px", height: "5px" }}>
                            <div 
                              className="progress-bar bg-success"
                              style={{ width: `${((batch.studentsCount || 0) / batch.maxStudents) * 100}%` }}
                            ></div>
                          </div>
                          <small>{batch.studentsCount || 0}/{batch.maxStudents}</small>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`badge ${
                          batch.status === "Ongoing" ? "bg-success" : 
                          batch.status === "Upcoming" ? "bg-primary" : "bg-secondary"
                        } px-3 py-2`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {batches.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
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

      {/* Modals */}
      {showViewModal && <ViewStudentModal />}
      {showDeleteModal && <DeleteConfirmationModal />}
      {showLogoutModal && <LogoutConfirmationModal />}
      {showAddStudentModal && <AddStudentModal />}
      {showAssignBatchModal && <AssignBatchModal />}
    </div>
  );
};

export default CounsellorDashboard;