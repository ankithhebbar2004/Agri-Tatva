import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HomePage.css';
import '../Navbar.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import heroImage from '../assets/heroimage.jpeg';
import logo from '../assets/logo.png';

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const underlineRef = useRef(null);
  const activeNavRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState('');
  const location = useLocation();
  const [prevPath, setPrevPath] = useState('/');
  
  // Determine slide direction based on navigation path
  useEffect(() => {
    // Get the index of current and previous path
    const paths = ['/', '/about', '/services', '/contact'];
    const currentIndex = paths.indexOf(location.pathname);
    const prevIndex = paths.indexOf(prevPath);
    
    // Set slide direction based on navigation flow
    if (currentIndex > prevIndex) {
      setSlideDirection('slide-right');
    } else if (currentIndex < prevIndex) {
      setSlideDirection('slide-left');
    }
    
    // Update previous path for next navigation
    setPrevPath(location.pathname);
  }, [location.pathname, prevPath]);
  
  // Effect to handle the sliding underline
  useEffect(() => {
    const positionUnderline = () => {
      if (activeNavRef.current && underlineRef.current) {
        const navItem = activeNavRef.current;
        const underline = underlineRef.current;
        
        // Position the underline under the active nav item
        underline.style.width = `${navItem.offsetWidth}px`;
        underline.style.left = `${navItem.offsetLeft}px`;
      }
    };
    
    // Position on initial render
    positionUnderline();
    
    // Reposition on window resize
    window.addEventListener('resize', positionUnderline);
    return () => window.removeEventListener('resize', positionUnderline);
  }, []);
  
  return (
    <div className={`homepage ${darkMode ? 'dark-mode' : ''}`}>
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
            <ul className="navbar-nav mx-auto underline-navbar-container">
              <div className={`nav-underline ${slideDirection}`} ref={underlineRef}></div>
              <li className="nav-item">
                <Link className="nav-link active" to="/" ref={activeNavRef}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
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
              <div className="hero-image-container">
                <img 
                  src={heroImage} 
                  alt="AI-powered crop yield prediction" 
                  className="img-fluid rounded hero-image"
                />
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

export default HomePage;
