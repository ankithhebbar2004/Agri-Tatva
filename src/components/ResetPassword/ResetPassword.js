import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import './ResetPassword.css';
import logo from '../assets/logo.png';

const ResetPassword = () => {
  const { darkMode } = useContext(ThemeContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('Please enter and confirm your new password.');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the token from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  
  // Redirect if no token is provided
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    } else {
      // If token exists, display welcoming message
      setMessage('Your password reset link has been received. Please create a new password below.');
    }
  }, [token, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords don't match.");
      return;
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      setIsError(true);
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);
    
    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        token,
        new_password: newPassword
      });
      
      if (response.data.success) {
        setResetComplete(true);
        setMessage('Password has been reset successfully! You can now login with your new password.');
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/auth');
        }, 5000);
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
    <div className={`reset-password-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card reset-password-card mt-5">
              <div className="text-center mb-4 mt-3">
                <img src={logo} alt="Logo" width="80" height="80" />
                <h2 className="mt-2">Create New Password</h2>
              </div>
              
              {!resetComplete ? (
                <>
                  <p className="text-center mb-4">
                    {message}
                  </p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="new-password" className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="confirm-password" className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {isError && (
                      <div className="alert alert-danger mb-3">
                        {message}
                      </div>
                    )}
                    
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-success"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center mb-4">
                  <div className="alert alert-success mb-3">
                    {message}
                  </div>
                  <p>Redirecting to login page in a few seconds...</p>
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

export default ResetPassword;