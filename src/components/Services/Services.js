import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';

const Services = () => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`services-page ${darkMode ? 'dark-mode' :''}`}>
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
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
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <Link to="/auth" className="btn btn-outline-success me-2">Login / Signup</Link>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Services Content Section */}
      <div className="services-section">
        <div className="container">
          <h1 className="text-center mb-5">Our Services</h1>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <div className="service-icon">
                  <p className="text-center text-muted">[Icon]</p>
                </div>
                <h3>Crop Yield Prediction</h3>
                <p>
                  Our AI-powered model predicts crop yields based on various factors including soil type, 
                  climate conditions, and historical data.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <div className="service-icon">
                  <p className="text-center text-muted">[Icon]</p>
                </div>
                <h3>Soil Analysis</h3>
                <p>
                  We provide comprehensive soil analysis to help you understand the nutrient content 
                  and health of your soil for optimal crop growth.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <div className="service-icon">
                  <p className="text-center text-muted">[Icon]</p>
                </div>
                <h3>Agricultural Consulting</h3>
                <p>
                  Our team of experts offers personalized consulting services to help you implement 
                  best practices and improve your farming operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`footer mt-5 py-4 ${darkMode ? 'bg-dark' : 'bg-light'}`}>
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

export default Services;