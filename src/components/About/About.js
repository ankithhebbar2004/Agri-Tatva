import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import logo from '../assets/logo.png';

const About = () => {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={`about-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container">
          <div className="navbar-brand">
          <img src={logo} alt="Logo" width="100" height="100" className="d-inline-block align-top" />
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
                <Link className="nav-link active" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
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

      {/* About Content Section */}
      <div className="about-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 text-center">
              <h1 className="mb-4">About Us</h1>
              <div className="about-image-placeholder mb-4">
                <p className="text-center text-muted">[Team Image Placeholder]</p>
              </div>
              <p className="lead">
                Founded in 2023, Crop Yield Predictor is dedicated to helping farmers maximize their crop yields through data-driven insights.
              </p>
              <p>
                Our team of agricultural experts and data scientists has developed a sophisticated machine learning model that analyzes various factors 
                such as soil type, climate conditions, and historical data to predict crop yields with remarkable accuracy.
              </p>
              <p>
                We believe in sustainable farming practices and are committed to helping farmers make informed decisions that benefit 
                both their businesses and the environment.
              </p>
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

export default About;