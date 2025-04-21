import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Contact.css';
import '../Navbar.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import logo from '../assets/logo.png';

const Contact = () => {
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

      {/* Contact Content Section */}
      <div className="contact-section">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <h1 className="mb-4">Contact Us</h1>
              <p className="lead">Have questions about our services? Reach out to us!</p>
              
              <div className="contact-info mt-4">
                <div className="contact-item">
                  <h5>Address</h5>
                  <p>123 Agricultural Way, Nitte Karkala</p>
                </div>
                <div className="contact-item">
                  <h5>Email</h5>
                  <p>contact@cropyieldpredictor.com</p>
                </div>
                <div className="contact-item">
                  <h5>Phone</h5>
                  <p>+1 (123) 456-7890</p>
                </div>
              </div>

              <div className="physical-contact-info mt-4">
                <h4 className="physical-contact-heading">Physical Contact Information</h4>
                <div className="contact-method">
                  <div className="contact-method-icon">
                    <i className="fas fa-building"></i>
                  </div>
                  <div className="contact-method-details">
                    <div className="contact-method-title">Main Office</div>
                    <p>123 Agricultural Way, Nitte<br/>Karkala, KA 574117</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="contact-method-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="contact-method-details">
                    <div className="contact-method-title">Phone</div>
                    <p>Main: +1 (123) 456-7890<br/>Support: +1 (123) 456-7891</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="contact-method-icon">
                    <i className="fas fa-fax"></i>
                  </div>
                  <div className="contact-method-details">
                    <div className="contact-method-title">Fax</div>
                    <p>+1 (123) 456-7892</p>
                  </div>
                </div>
              </div>
              
              <div className="courier-info mt-4">
                <h5>For Courier & Packages</h5>
                <p>Please address all shipments to "Crop Yield Predictor - Attention: Receiving Department" and include our full address.</p>
              </div>
              
              <div className="business-hours mt-4">
                <h5>Business Hours</h5>
                <div className="hours-grid">
                  <div className="hours-item">
                    <span className="hours-day">Monday - Friday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="hours-day">Saturday:</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="hours-item">
                    <span className="hours-day">Sunday:</span>
                    <span>Closed</span>
                  </div>
                  <div className="hours-item">
                    <span className="hours-day">Holidays:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="contact-map-container">
                <h3 className="mb-3">Find Us</h3>
                <div className="map-container">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3120.0286405540383!2d-121.49099048451395!3d38.576764979620136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ad0d64966c16f%3A0x93a9f42e09e3af6b!2sCalifornia%20State%20Capitol%20Park!5e0!3m2!1sen!2sus!4v1627309750174!5m2!1sen!2sus" 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Office Location Map"
                  ></iframe>
                </div>
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