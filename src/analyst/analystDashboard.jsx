import React, { useState } from "react";

const AnalystDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batchName: "",
    course: "",
    trainer: "",
    startDate: "",
    endDate: "",
    maxStudents: "",
    mode: "Online",
    status: "Upcoming",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create Batch
  const handleSubmit = (e) => {
    e.preventDefault();

    const newBatch = {
      id: Date.now(),
      ...formData,
      studentsEnrolled: 0,
    };

    setBatches([...batches, newBatch]);

    // Reset Form
    setFormData({
      batchName: "",
      course: "",
      trainer: "",
      startDate: "",
      endDate: "",
      maxStudents: "",
      mode: "Online",
      status: "Upcoming",
    });
  };

  // Delete Batch
  const handleDelete = (id) => {
    const filtered = batches.filter((batch) => batch.id !== id);
    setBatches(filtered);
  };

  // Stats
  const totalBatches = batches.length;
  const ongoingBatches = batches.filter(
    (b) => b.status === "Ongoing"
  ).length;
  const completedBatches = batches.filter(
    (b) => b.status === "Completed"
  ).length;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">Analyst Dashboard - Batch Management</h2>

      {/* Stats Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>Total Batches</h5>
            <h3>{totalBatches}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>Ongoing Batches</h5>
            <h3>{ongoingBatches}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h5>Completed Batches</h5>
            <h3>{completedBatches}</h3>
          </div>
        </div>
      </div>

      {/* Create Batch Form */}
      <div className="card p-4 shadow mb-4">
        <h4 className="mb-3">Create New Batch</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                name="batchName"
                placeholder="Batch Name"
                value={formData.batchName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                name="course"
                placeholder="Course Name"
                value={formData.course}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                name="trainer"
                placeholder="Trainer Name"
                value={formData.trainer}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <input
                type="number"
                className="form-control"
                name="maxStudents"
                placeholder="Max Students"
                value={formData.maxStudents}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <select
                className="form-control"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div className="col-md-4 mb-3">
              <select
                className="form-control"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Upcoming</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Batch
          </button>
        </form>
      </div>

      {/* Batch Table */}
      <div className="card p-4 shadow">
        <h4 className="mb-3">Manage Batches</h4>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Batch</th>
              <th>Course</th>
              <th>Trainer</th>
              <th>Status</th>
              <th>Mode</th>
              <th>Max Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No batches created yet.
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.id}>
                  <td>{batch.batchName}</td>
                  <td>{batch.course}</td>
                  <td>{batch.trainer}</td>
                  <td>{batch.status}</td>
                  <td>{batch.mode}</td>
                  <td>{batch.maxStudents}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(batch.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalystDashboard;