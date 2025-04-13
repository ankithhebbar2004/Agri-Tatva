import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import CropYieldForm from './components/CropYieldForm';
import AuthForm from './components/AuthForm/AuthForm';
import HomePage from './components/HomePage/HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };
  
  function AppRoutes() {
    const navigate = useNavigate();
    
    const goToHome = () => {
      navigate('/');
    };

    return (
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/auth" 
            element={!isLoggedIn ? <AuthForm onLogin={handleLogin} goToHome={goToHome} /> : <Navigate to="/predict" />} 
          />
          <Route 
            path="/predict" 
            element={isLoggedIn ? <CropYieldForm goToHome={goToHome} /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
