import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <div className="navbar-brand">
            <img src="/logo-placeholder.png" alt="Logo" width="30" height="30" className="d-inline-block align-top me-2" />
            <span>Crop Yield Predictor</span>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="#">Contact</Link>
              </li>
            </ul>
            <div className="d-flex">
              <Link to="/auth" className="btn btn-outline-success me-2">Login / Signup</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>Predict Crop Yields with Precision</h1>
              <p className="lead">
                Our AI-powered analytics helps farmers and agricultural businesses make data-driven decisions for better crop yields and resource management.
              </p>
              <Link to="/auth" className="btn btn-success btn-lg">Get Started</Link>
            </div>
            <div className="col-md-6">
              {/* Placeholder for hero image */}
              <div className="hero-image-placeholder">
                <p className="text-center text-muted">[Hero Image Placeholder]</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer mt-5 py-4 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>Crop Yield Predictor</h5>
              <p>Advanced crop yield predictions using machine learning technology.</p>
            </div>
            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/auth">Login</Link></li>
                <li><Link to="#">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contact Us</h5>
              <p>Email: contact@cropyieldpredictor.com</p>
              <p>Phone: +1 (123) 456-7890</p>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="mb-0">© {new Date().getFullYear()} Crop Yield Predictor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
