import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './About.css';
import '../Navbar.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import logo from '../assets/logo.png';
import abouts from '../assets/about.jpg';

const About = () => {
  const { darkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const underlineRef = useRef(null);
  const activeNavRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState('');
  const location = useLocation();
  const [prevPath, setPrevPath] = useState('/');
  
  // Determine slide direction based on navigation path
  useEffect(() => {
    const paths = ['/', '/about', '/services', '/contact'];
    const currentIndex = paths.indexOf(location.pathname);
    const prevIndex = paths.indexOf(prevPath);
    
    if (currentIndex > prevIndex) {
      setSlideDirection('slide-right');
    } else if (currentIndex < prevIndex) {
      setSlideDirection('slide-left');
    }
    
    setPrevPath(location.pathname);
  }, [location.pathname, prevPath]);
  
  // Effect to handle the sliding underline
  useEffect(() => {
    const positionUnderline = () => {
      if (activeNavRef.current && underlineRef.current) {
        const navItem = activeNavRef.current;
        const underline = underlineRef.current;
        
        underline.style.width = `${navItem.offsetWidth}px`;
        underline.style.left = `${navItem.offsetLeft}px`;
      }
    };
    
    positionUnderline();
    
    window.addEventListener('resize', positionUnderline);
    return () => window.removeEventListener('resize', positionUnderline);
  }, []);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
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
            <ul className="navbar-nav mx-auto underline-navbar-container">
              <div className={`nav-underline ${slideDirection}`} ref={underlineRef}></div>
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/about" ref={activeNavRef}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger me-2"
                >
                  Sign Out
                </button>
              ) : (
                <Link to="/auth" className="btn btn-outline-success me-2">Login / Signup</Link>
              )}
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
              
              <img src={abouts} alt=" About us" className="about-image-placeholder mb-4" />
              
              <p className="lead">
                Crop Yield Predictor is dedicated to helping farmers maximize their crop yields through data-driven insights.
              </p>
              <p>
                Our team has developed a sophisticated machine learning model that analyzes various factors 
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