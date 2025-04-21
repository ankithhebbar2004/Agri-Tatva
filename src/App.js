import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import CropYieldForm from './components/CropYieldForm';
import AuthForm from './components/AuthForm/AuthForm';
import HomePage from './components/HomePage/HomePage';
import About from './components/About/About';
import Services from './components/Services/Services';
import Contact from './components/Contact/Contact';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  // Add useEffect to initialize Bootstrap's JavaScript
  useEffect(() => {
    // Load Bootstrap JavaScript for navbar toggling
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
    script.integrity = "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p";
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function AppRoutes() {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const goToHome = () => {
      navigate('/');
    };

    return (
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/auth" 
            element={!isLoggedIn ? <AuthForm goToHome={goToHome} /> : <Navigate to="/predict" />} 
          />
          <Route 
            path="/predict" 
            element={isLoggedIn ? <CropYieldForm goToHome={goToHome} /> : <Navigate to="/auth" />} 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;