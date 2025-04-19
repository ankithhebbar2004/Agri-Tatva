import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Services.css';
import '../Navbar.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import logo from '../assets/logo.png';
import agri from '../assets/agri.png';
import soil from '../assets/soil.png';
import pred from '../assets/agripred.png';

const Services = () => {
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
    <div className={`services-page ${darkMode ? 'dark-mode' : ''}`}>
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
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/services" ref={activeNavRef}>Services</Link>
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

      {/* Rest of the Services component remains the same */}

      {/* Services Content Section */}
      <div className="services-section">
        <div className="container">
          <h1 className="text-center mb-5">Our Services</h1>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="service-card">
                <div className="service-icon">
                <img src={pred} alt=" PredAnalysis" className="service-icon-img rounded-circle" />
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
                <img src={soil} alt=" Soil Analysis" className="service-icon-img rounded-circle" />
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
                <img src={agri} alt="Agricultural Consulting" className="service-icon-img rounded-circle" />
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