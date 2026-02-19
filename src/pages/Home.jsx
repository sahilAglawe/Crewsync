import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <>
    
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">
            Crewsync
          </span>

          <div>
            <Link to="/login" className="btn btn-outline-light me-2">
              Login
            </Link>
          </div>
        </div>
      </nav>

    
      <div className="container text-center mt-5">
        <h1 className="display-4 fw-bold">
          Role-Based Employee Management Platform
        </h1>
        <p className="lead mt-3">
          Manage Admin, Trainers, Analysts, and Counselors efficiently
          with secure authentication and real-time data handling.
        </p>

        <div className="mt-4">
          <Link to="/login" className="btn btn-primary btn-lg me-3">
            Get Started
          </Link>
          <Link to="/register" className="btn btn-outline-secondary btn-lg">
            Create Account
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
