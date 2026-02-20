import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployees: 0,
    activeTrainers: 0,
    activeAnalysts: 0,
    activeCounselors: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching data
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "ADMIN", status: "Active" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "TRAINER", status: "Active" },
      { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "ANALYST", status: "Active" },
      { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "COUNSELOR", status: "Inactive" },
    ];

    const mockEmployees = [
      { id: 1, name: "Alice Brown", department: "Engineering", position: "Software Developer", status: "Active" },
      { id: 2, name: "Bob Davis", department: "Marketing", position: "Marketing Specialist", status: "Active" },
      { id: 3, name: "Carol Martinez", department: "HR", position: "HR Coordinator", status: "On Leave" },
      { id: 4, name: "David Lee", department: "Sales", position: "Sales Executive", status: "Active" },
    ];

    setUsers(mockUsers);
    setEmployees(mockEmployees);
    
    setStats({
      totalUsers: mockUsers.length,
      totalEmployees: mockEmployees.length,
      activeTrainers: mockUsers.filter(u => u.role === "TRAINER" && u.status === "Active").length,
      activeAnalysts: mockUsers.filter(u => u.role === "ANALYST" && u.status === "Active").length,
      activeCounselors: mockUsers.filter(u => u.role === "COUNSELOR" && u.status === "Active").length,
    });
  }, []);

  const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?"); // use for confirmation before logout

  if (confirmLogout) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  }

};
  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: "280px", minHeight: "100vh", position: "fixed" }}>
        <div className="p-4">
          <h4 className="fw-bold mb-4 text-primary">CrewSync</h4>
          
          <div className="mb-4">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: "45px", height: "45px" }}>
                <i className="bi bi-person-fill text-white fs-4"></i>
              </div>
              <div className="ms-3">
                <p className="mb-0 fw-bold">Admin User</p>
                <small className="text-secondary">Administrator</small>
              </div>
            </div>
          </div>

         <nav className="nav flex-column">
  <button
    className={`nav-link text-white mb-2 text-start w-100 border-0 bg-transparent ${activeTab === "dashboard" ? "bg-primary rounded" : ""}`}
    onClick={() => setActiveTab("dashboard")}
    style={{ padding: "12px 16px" }}
  >
    <i className="bi bi-speedometer2 me-3"></i> Dashboard
  </button>

  <button
    className={`nav-link text-white mb-2 text-start w-100 border-0 bg-transparent ${activeTab === "trainer" ? "bg-primary rounded" : ""}`}
    onClick={() => setActiveTab("trainer")}
    style={{ padding: "12px 16px" }}
  >
    <i className="bi bi-person-badge me-3"></i> Manage Trainer
  </button>

  <button
    className={`nav-link text-white mb-2 text-start w-100 border-0 bg-transparent ${activeTab === "counselor" ? "bg-primary rounded" : ""}`}
    onClick={() => setActiveTab("counselor")}
    style={{ padding: "12px 16px" }}
  >
    <i className="bi bi-person-heart me-3"></i> Manage Counselor
  </button>

  <button
    className={`nav-link text-white mb-2 text-start w-100 border-0 bg-transparent ${activeTab === "analyst" ? "bg-primary rounded" : ""}`}
    onClick={() => setActiveTab("analyst")}
    style={{ padding: "12px 16px" }}
  >
    <i className="bi bi-graph-up-arrow me-3"></i> Manage Analyst
  </button>

  <hr className="text-secondary" />

  <button
    className="nav-link text-danger text-start w-100 border-0 bg-transparent"
    onClick={handleLogout}
    style={{ padding: "12px 16px" }}
  >
    <i className="bi bi-box-arrow-right me-3"></i> Logout
  </button>


</nav> 
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: "280px" }}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4" style={{ height: "70px" }}>
          <div className="container-fluid">
            <h5 className="mb-0 fw-bold text-primary">
  {activeTab === "dashboard" && "Dashboard"}
  {activeTab === "trainer" && "Trainer Management"}
  {activeTab === "counselor" && "Counselor Management"}
  {activeTab === "analyst" && "Analyst Management"}
</h5>
            
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button className="btn btn-link text-dark text-decoration-none dropdown-toggle" 
                        type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                  <i className="bi bi-bell me-3"></i>
                  <span className="badge bg-danger rounded-pill">3</span>
                </button>
              </div>
              
              <div className="dropdown ms-3">
                <button className="btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center"
                        type="button" data-bs-toggle="dropdown">
                  <img src={`https://ui-avatars.com/api/?name=Admin+User&background=0d6efd&color=fff&rounded=true`} 
                       alt="Profile" 
                       className="rounded-circle me-2"
                       style={{ width: "35px", height: "35px" }} />
                  <span>Admin</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i> Profile</a></li>
                  <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i> Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger" href="#" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i> Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-people-fill text-primary fs-3"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-secondary mb-1">Total Users</h6>
                          <h3 className="mb-0 fw-bold">{stats.totalUsers}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-person-workspace text-success fs-3"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-secondary mb-1">Total Employees</h6>
                          <h3 className="mb-0 fw-bold">{stats.totalEmployees}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 p-3 rounded-3">
                          <i className="bi bi-bar-chart-line text-warning fs-3"></i>
                        </div>
                        <div className="ms-3">
                          <h6 className="text-secondary mb-1">Active Roles</h6>
                          <h3 className="mb-0 fw-bold">{stats.activeTrainers + stats.activeAnalysts + stats.activeCounselors}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Distribution */}
              <div className="row g-4 mb-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                      <h6 className="fw-bold mb-0">Role Distribution</h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3">
                          <div className="text-center p-3 bg-primary bg-opacity-10 rounded-3">
                            <h5 className="text-primary mb-1">{stats.activeTrainers}</h5>
                            <small className="text-secondary">Trainers</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center p-3 bg-success bg-opacity-10 rounded-3">
                            <h5 className="text-success mb-1">{stats.activeAnalysts}</h5>
                            <small className="text-secondary">Analysts</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center p-3 bg-warning bg-opacity-10 rounded-3">
                            <h5 className="text-warning mb-1">{stats.activeCounselors}</h5>
                            <small className="text-secondary">Counselors</small>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="text-center p-3 bg-info bg-opacity-10 rounded-3">
                            <h5 className="text-info mb-1">1</h5>
                            <small className="text-secondary">Admins</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                      <h6 className="fw-bold mb-0">Quick Actions</h6>
                    </div>
                    <div className="card-body">
                      <button className="btn btn-primary w-100 mb-2" onClick={() => setActiveTab("users")}>
                        <i className="bi bi-person-plus me-2"></i> Add New User
                      </button>
                      <button className="btn btn-outline-primary w-100" onClick={() => setActiveTab("employees")}>
                        <i className="bi bi-plus-circle me-2"></i> Add Employee
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">Recent Users</h6>
                  <button className="btn btn-link text-primary text-decoration-none" onClick={() => setActiveTab("users")}>
                    View All <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3">Name</th>
                          <th className="py-3">Email</th>
                          <th className="py-3">Role</th>
                          <th className="py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 3).map((user) => (
                          <tr key={user.id}>
                            <td className="py-3">
                              <div className="d-flex align-items-center">
                                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random&rounded=true`} 
                                     alt={user.name} 
                                     className="rounded-circle me-2"
                                     style={{ width: "35px", height: "35px" }} />
                                {user.name}
                              </div>
                            </td>
                            <td className="py-3">{user.email}</td>
                            <td className="py-3">
                              <span className={`badge ${
                                user.role === "ADMIN" ? "bg-danger" :
                                user.role === "TRAINER" ? "bg-primary" :
                                user.role === "ANALYST" ? "bg-success" : "bg-warning"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}



          {activeTab === "trainer" && (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5 className="fw-bold">All Trainers</h5>
    </div>

    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === "TRAINER").map(user => (
                <tr key={user.id}>
                  <td className="py-3">{user.name}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}



         {activeTab === "counselor" && (
  <div>
    <h5 className="fw-bold mb-4">All Counselors</h5>

    <div className="card border-0 shadow-sm">
      <div className="card-body">
        {users.filter(u => u.role === "COUNSELOR").map(user => (
          <div key={user.id} className="mb-3 p-3 bg-light rounded">
            <strong>{user.name}</strong> <br />
            <small>{user.email}</small>
          </div>
        ))}
      </div>
    </div>
  </div>
)}


          {activeTab === "analyst" && (
  <div>
    <h5 className="fw-bold mb-4">All Analysts</h5>

    <div className="card border-0 shadow-sm">
      <div className="card-body">
        {users.filter(u => u.role === "ANALYST").map(user => (
          <div key={user.id} className="mb-3 p-3 bg-light rounded">
            <strong>{user.name}</strong> <br />
            <small>{user.email}</small>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
         
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select className="form-select">
                      <option>ADMIN</option>
                      <option>TRAINER</option>
                      <option>ANALYST</option>
                      <option>COUNSELOR</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowAddUserModal(false)}>Add User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Employee</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddEmployeeModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Position</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-control" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEmployeeModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowAddEmployeeModal(false)}>Add Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;