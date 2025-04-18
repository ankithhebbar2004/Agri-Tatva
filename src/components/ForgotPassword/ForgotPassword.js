import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import './ForgotPassword.css';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const { darkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [debugLink, setDebugLink] = useState(''); // For demo purposes only

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);
    
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      
      if (response.data.success) {
        setResetSent(true);
        setMessage(response.data.message);
        // In development mode, store the debug link
        if (response.data.debug_link) {
          setDebugLink(response.data.debug_link);
        }
      } else {
        setIsError(true);
        setMessage(response.data.message);
      }
    } catch (error) {
      setIsError(true);
      setMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`forgot-password-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card forgot-password-card mt-5">
              <div className="text-center mb-4 mt-3">
                <img src={logo} alt="Logo" width="80" height="80" />
                <h2 className="mt-2">Reset Password</h2>
              </div>
              
              {!resetSent ? (
                <>
                  <p className="text-center mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    {message && (
                      <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mb-3`}>
                        {message}
                      </div>
                    )}
                    
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center mb-4">
                  <div className="alert alert-success mb-3">
                    {message}
                  </div>
                  
                  <p>
                    Please check your email inbox and spam folder for the password reset link.
                  </p>
                  
                  {/* Only show debug link in development mode */}
                  {debugLink && (
                    <div className="debug-link mt-3 mb-3">
                      <p className="mb-1"><small>Development Only - Reset Link:</small></p>
                      <a href={debugLink} className="small">{debugLink}</a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-center mt-3 mb-3">
                <Link to="/auth" className="text-decoration-none">Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
