import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Contact.css';
import '../Navbar.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import logo from '../assets/logo.png';

const Contact = () => {
  const { darkMode } = useContext(ThemeContext);
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
  
  return (
    <div className={`contact-page ${darkMode ? 'dark-mode' : ''}`}>
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
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/contact" ref={activeNavRef}>Contact</Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <Link to="/auth" className="btn btn-outline-success me-2">Login / Signup</Link>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Content Section */}
      <div className="contact-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h1 className="mb-4">Contact Us</h1>
              <p className="lead">Have questions about our services? Reach out to us!</p>
              
              <div className="contact-info mt-4">
                <div className="contact-item">
                  <h5>Address</h5>
                  <p>123 Agricultural Way, Farmville, CA 95814</p>
                </div>
                <div className="contact-item">
                  <h5>Email</h5>
                  <p>contact@cropyieldpredictor.com</p>
                </div>
                <div className="contact-item">
                  <h5>Phone</h5>
                  <p>+1 (123) 456-7890</p>
                </div>
                <div className="contact-item">
                  <h5>Hours</h5>
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="contact-form-container">
                <h3 className="mb-3">Send us a message</h3>
                <form className="contact-form">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter your name" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input type="text" className="form-control" id="subject" placeholder="Subject" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea className="form-control" id="message" rows="5" placeholder="Your message" required></textarea>
                  </div>
                  <button type="submit" className="btn btn-success">Send Message</button>
                </form>
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

export default Contact;