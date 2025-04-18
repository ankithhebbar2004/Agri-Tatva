import React, { useState } from 'react';
import './AuthForm.css';
import { Link } from 'react-router-dom';

const AuthForm = ({ onLogin, goToHome }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login logic
        if (formData.email && formData.password) {
          const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log('Login successful', data);
            // Store user data in localStorage or sessionStorage if needed
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(true);
          } else {
            setError(data.message);
          }
        }
      } else {
        // Sign up validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.email && formData.password && formData.name) {
          const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password
            }),
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log('Signup successful', data);
            // Auto login after signup
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(true);
          } else {
            setError(data.message);
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  // When submitting predictions, get the user_id from localStorage:
  const userData = localStorage.getItem('user');
  let userId = null;

  if (userData) {
    const user = JSON.parse(userData);
    userId = user.user_id;  // Use the stable user_id field we added
  }

  // Then include it in your prediction API call
  const submitPrediction = async (predictionData) => {
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...predictionData,
          user_id: userId  // Add the user ID here
        })
      });
      const data = await response.json();
      console.log('Prediction response:', data);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };
  
  return (
    <div className="auth-container">
      <button className="home-button" onClick={goToHome}>Back to Home</button>
      <div className="card shadow auth-card">
        <div className="card-body auth-card-body">
          <h2 className="text-center auth-header">{isLogin ? 'Login' : 'Sign Up'}</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {isLogin && (
                <div className="text-end mt-1">
                  <Link to="/forgot-password" className="text-decoration-none small">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>
            
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 mt-3 auth-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
          
          <div className="text-center auth-toggle-text">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="btn btn-link p-0 auth-toggle-button" 
                onClick={toggleAuthMode}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
         
          <div className="auth-divider">Or continue with</div>
          <div className="social-buttons">
            <button type="button" className="social-btn google-btn">
              <img 
                src="https://icon2.cleanpng.com/20240216/yhs/transparent-google-logo-google-logo-with-colorful-letters-on-black-1710875297222.webp" 
                alt="Google logo" 
                className="google-icon" 
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
