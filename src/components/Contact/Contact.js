import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
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
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/contact">Contact</Link>
              </li>
            </ul>
            <div className="d-flex">
              <Link to="/auth" className="btn btn-outline-success me-2">Login / Signup</Link>
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

export default Contact;