import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onLogin, goToHome }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (isLogin) {
      if (formData.email && formData.password) {
        // For now, just allow login with any data
        console.log('Login successful', formData);
        onLogin(true);
      }
    } else {
      // Sign up validation
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (formData.email && formData.password && formData.name) {
        // For now, just simulate successful signup
        console.log('Signup successful', formData);
        // Auto login after signup
        onLogin(true);
      }
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <div className="auth-container">
      <button className="home-button" onClick={goToHome}>Back to Home</button>
      <div className="card shadow auth-card">
        <div className="card-body auth-card-body">
          <h2 className="text-center auth-header">{isLogin ? 'Login' : 'Sign Up'}</h2>
          
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
            
            <button type="submit" className="btn btn-primary w-100 mt-3 auth-button">
              {isLogin ? 'Login' : 'Sign Up'}
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
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
