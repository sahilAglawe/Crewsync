import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  return (
    <>
      
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top shadow"
        style={{ backgroundColor: "#0d1b2a" }}
      >
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="#home">
            CrewSync
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <a className="nav-link text-light" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#roles">Roles</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#contact">Contact</a>
              </li>
              <li className="nav-item ms-lg-3">
                <Link to="/login" className="btn btn-primary px-4">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="d-flex align-items-center text-white"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1b263b, #415a77)",
          paddingTop: "80px",
        }}
      >
        <div className="container text-center">
          <h1 className="display-3 fw-bold">
            Smart Employee Management System
          </h1>
          <p className="lead mt-4 mx-auto" style={{ maxWidth : "700px" }}>
            CrewSync helps organizations efficiently manage Admins,
            Trainers, Analysts, and Counselors with secure authentication
            and centralized workforce control.
          </p>

          <div className="mt-4">
            <Link to="/login" className="btn btn-light btn-lg px-5 fw-bold">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section id="roles" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Our Employee Roles</h2>

          <div className="row g-4">
            {[
              {
                title: "Admin",
                desc: "Complete system control. Manages users, assigns roles, monitors reports and maintains database.",
              },
              {
                title: "Trainer",
                desc: "Conducts training sessions, assigns tasks and tracks employee progress.",
              },
              {
                title: "Analyst",
                desc: "Analyzes performance data and generates insightful reports for decision-making.",
              },
              {
                title: "Counselor",
                desc: "Provides guidance, maintains confidential records and supports employee well-being.",
              },
            ].map((role, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div
                  className="card border-0 shadow-lg h-100 text-center p-4"
                  style={{
                    borderRadius: "15px",
                    transition: "0.3s",
                  }}
                >
                  <h5 className="fw-bold text-primary">{role.title}</h5>
                  <p className="text-muted mt-3">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      <section id="about" className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">About CrewSync</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: "800px" }}>
            CrewSync is a next-generation employee management system designed
            to streamline organizational workflows through secure,
            scalable and efficient role-based architecture.
          </p>
        </div>
      </section>

      <section id="contact" className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-4">Contact Us</h2>
          <p className="text-muted">📧 support@crewsync.com</p>
          <p className="text-muted">📞 +91 9876543210</p>
          <p className="text-muted">📍 India</p>
        </div>
      </section>

  
      <footer
        className="text-light text-center py-4"
        style={{ backgroundColor: "#0d1b2a" }}
      >
        © 2026 CrewSync. All Rights Reserved.
      </footer>
    </>
  );
};

export default Home;
