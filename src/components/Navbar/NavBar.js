import React, { useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import logo from '../assets/logo.png';
import '../Navbar.css';

const NavBar = ({ activePage }) => {
  const { darkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const underlineRef = useRef(null);
  const activeNavRef = useRef(null);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
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
            <div className="nav-underline" ref={underlineRef}></div>
            <li className="nav-item">
              <Link 
                className={`nav-link ${activePage === 'home' ? 'active' : ''}`} 
                to="/"
                ref={activePage === 'home' ? activeNavRef : null}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${activePage === 'about' ? 'active' : ''}`} 
                to="/about"
                ref={activePage === 'about' ? activeNavRef : null}
              >
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${activePage === 'services' ? 'active' : ''}`} 
                to="/services"
                ref={activePage === 'services' ? activeNavRef : null}
              >
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${activePage === 'contact' ? 'active' : ''}`} 
                to="/contact"
                ref={activePage === 'contact' ? activeNavRef : null}
              >
                Contact
              </Link>
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
  );
};

export default NavBar;
