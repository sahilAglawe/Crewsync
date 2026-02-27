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
          <p className="lead mt-4 mx-auto" style={{ maxWidth: "700px" }}>
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

      {/* ─── Roles Section ─────────────────────────────────────────── */}
      <section id="roles" className="py-5" style={{ background: '#f5f7fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 mb-3" style={{ background: 'rgba(74,158,255,0.1)', color: '#4a9eff', fontSize: '0.85rem' }}>
              Team Structure
            </span>
            <h2 className="fw-bold" style={{ color: '#1a1e2b' }}>Our Employee Roles</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Each role is carefully designed to maximize productivity and collaboration across your organization.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                title: "Admin", icon: "bi-shield-lock-fill", color: "#dc3545", bg: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                desc: "Complete system control. Manages users, assigns roles, monitors reports and maintains the entire database."
              },
              {
                title: "Trainer", icon: "bi-person-workspace", color: "#f5576c", bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                desc: "Conducts training sessions, manages batches, assigns tasks and tracks employee progress effectively."
              },
              {
                title: "Analyst", icon: "bi-graph-up", color: "#4a9eff", bg: "linear-gradient(135deg, #4a9eff 0%, #2774b0 100%)",
                desc: "Creates and manages batches, analyzes performance data and generates insightful reports for decision-making."
              },
              {
                title: "Counselor", icon: "bi-chat-heart-fill", color: "#fd7e14", bg: "linear-gradient(135deg, #fd7e14 0%, #e8590c 100%)",
                desc: "Manages students, provides guidance, maintains records and supports employee well-being."
              },
            ].map((role, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card border-0 shadow h-100 text-center p-4"
                  style={{ borderRadius: '16px', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)', cursor: 'default', overflow: 'hidden', position: 'relative' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}>
                  {/* Top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: role.bg }}></div>
                  {/* Icon */}
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '64px', height: '64px', background: `${role.color}15` }}>
                    <i className={`bi ${role.icon}`} style={{ fontSize: '1.8rem', color: role.color }}></i>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#1a1e2b' }}>{role.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About Section ───────────────────────────────────────────── */}
      <section id="about" className="py-5" style={{ background: '#fff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 mb-3" style={{ background: 'rgba(74,158,255,0.1)', color: '#4a9eff', fontSize: '0.85rem' }}>
              About Us
            </span>
            <h2 className="fw-bold" style={{ color: '#1a1e2b' }}>About CrewSync</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              CrewSync is a next-generation employee management system designed
              to streamline organizational workflows through secure,
              scalable and efficient role-based architecture.
            </p>
          </div>

          <div className="row g-4">
            {[
              { icon: "bi-lock-fill", title: "Secure Access", desc: "Role-based authentication keeps your data safe and access controlled.", color: "#dc3545" },
              { icon: "bi-speedometer2", title: "Real-Time Dashboard", desc: "Monitor team activity, stats and performance in a single glance.", color: "#4a9eff" },
              { icon: "bi-people-fill", title: "Team Collaboration", desc: "Seamless coordination between admins, trainers, analysts and counselors.", color: "#28a745" },
              { icon: "bi-bar-chart-line-fill", title: "Smart Analytics", desc: "Data-driven insights and reports to power strategic decision making.", color: "#8B5CF6" },
              { icon: "bi-cloud-check-fill", title: "Cloud-Ready", desc: "Lightweight, fast and designed for modern cloud-based workflows.", color: "#fd7e14" },
              { icon: "bi-phone-fill", title: "Responsive Design", desc: "Access your dashboard from any device — desktop, tablet or mobile.", color: "#14B8A6" },
            ].map((item, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="d-flex align-items-start p-3 rounded-3"
                  style={{ transition: 'all 0.3s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fa'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', background: `${item.color}15`, flexShrink: 0 }}>
                    <i className={`bi ${item.icon}`} style={{ fontSize: '1.3rem', color: item.color }}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#1a1e2b' }}>{item.title}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact Section ─────────────────────────────────────────── */}
      <section id="contact" className="py-5" style={{ background: '#f5f7fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 mb-3" style={{ background: 'rgba(74,158,255,0.1)', color: '#4a9eff', fontSize: '0.85rem' }}>
              Get In Touch
            </span>
            <h2 className="fw-bold" style={{ color: '#1a1e2b' }}>Contact Us</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Have questions or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { icon: "bi-envelope-fill", label: "Email Us", value: "support@crewsync.com", color: "#4a9eff" },
              { icon: "bi-telephone-fill", label: "Call Us", value: "+91 9876543210", color: "#28a745" },
              { icon: "bi-geo-alt-fill", label: "Visit Us", value: "Pune, India", color: "#fd7e14" },
            ].map((item, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card border-0 shadow text-center p-4 h-100"
                  style={{ borderRadius: '16px', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}>
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '60px', height: '60px', background: `${item.color}15` }}>
                    <i className={`bi ${item.icon}`} style={{ fontSize: '1.5rem', color: item.color }}></i>
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1a1e2b' }}>{item.label}</h6>
                  <p className="text-muted mb-0">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Premium Footer ──────────────────────────────────────────── */}
      <footer style={{ background: 'linear-gradient(180deg, #1a1e2b 0%, #0d1117 100%)' }}>
        {/* Gradient divider */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #4a9eff, #8B5CF6, #f5576c, #fd7e14, #28a745)' }}></div>

        <div className="container py-5">
          <div className="row g-4">
            {/* Brand Column */}
            <div className="col-lg-4 mb-3">
              <h4 className="fw-bold mb-3" style={{ color: '#4a9eff' }}>CrewSync</h4>
              <p className="text-white-50" style={{ fontSize: '0.9rem', lineHeight: '1.7', maxWidth: '320px' }}>
                A next-generation employee management system built for modern organizations. Streamline your workforce with secure, role-based architecture.
              </p>
              {/* Social Icons */}
              <div className="d-flex gap-2 mt-3">
                {[
                  { icon: "bi-linkedin", color: "#0A66C2" },
                  { icon: "bi-github", color: "#f0f0f0" },
                  { icon: "bi-twitter-x", color: "#f0f0f0" },
                  { icon: "bi-instagram", color: "#E1306C" },
                ].map((social, idx) => (
                  <a key={idx} href="#" className="d-flex align-items-center justify-content-center rounded-circle text-decoration-none"
                    style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.08)', color: social.color, transition: 'all 0.3s ease', fontSize: '1rem' }}
                    onMouseEnter={e => { e.currentTarget.style.background = social.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = social.color; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <i className={`bi ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold text-white mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                {["Home", "Roles", "About", "Contact"].map((link, idx) => (
                  <li key={idx} className="mb-2">
                    <a href={`#${link.toLowerCase()}`} className="text-white-50 text-decoration-none"
                      style={{ fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#4a9eff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = ''; }}>
                      <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>{link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roles */}
            <div className="col-6 col-lg-2">
              <h6 className="fw-bold text-white mb-3">Roles</h6>
              <ul className="list-unstyled">
                {["Admin", "Trainer", "Analyst", "Counselor"].map((role, idx) => (
                  <li key={idx} className="mb-2">
                    <a href="#roles" className="text-white-50 text-decoration-none"
                      style={{ fontSize: '0.9rem', transition: 'color 0.2s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#4a9eff'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = ''; }}>
                      <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>{role}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4">
              <h6 className="fw-bold text-white mb-3">Contact Info</h6>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: '36px', height: '36px', background: 'rgba(74,158,255,0.15)', flexShrink: 0 }}>
                  <i className="bi bi-envelope-fill" style={{ color: '#4a9eff', fontSize: '0.9rem' }}></i>
                </div>
                <span className="text-white-50" style={{ fontSize: '0.9rem' }}>support@crewsync.com</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: '36px', height: '36px', background: 'rgba(40,167,69,0.15)', flexShrink: 0 }}>
                  <i className="bi bi-telephone-fill" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                </div>
                <span className="text-white-50" style={{ fontSize: '0.9rem' }}>+91 9876543210</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: '36px', height: '36px', background: 'rgba(253,126,20,0.15)', flexShrink: 0 }}>
                  <i className="bi bi-geo-alt-fill" style={{ color: '#fd7e14', fontSize: '0.9rem' }}></i>
                </div>
                <span className="text-white-50" style={{ fontSize: '0.9rem' }}>Pune, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
            <p className="text-white-50 small mb-2 mb-md-0">© 2026 CrewSync. All Rights Reserved.</p>
            <div className="d-flex gap-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, idx) => (
                <a key={idx} href="#" className="text-white-50 text-decoration-none small"
                  style={{ transition: 'color 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#4a9eff'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
