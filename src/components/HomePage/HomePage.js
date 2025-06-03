import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HomePage.css';
import '../Navbar.css';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import heroImage from '../assets/heroimage.jpeg';
import logo from '../assets/logo.png';

const HomePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const underlineRef = useRef(null);
  const activeNavRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState('');
  const location = useLocation();
  const [prevPath, setPrevPath] = useState('/');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  
  // Stats counter animation
  const [counters, setCounters] = useState({
    farmers: 0,
    acres: 0,
    accuracy: 0,
    crops: 0
  });
  
  // For stats counter animation
  useEffect(() => {
    const targetValues = {
      farmers: 10000,
      acres: 250000,
      accuracy: 95,
      crops: 50
    };
    
    const duration = 2000; // ms
    const frameRate = 50;
    const totalFrames = duration / frameRate;
    let frame = 0;
    
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      if (frame <= totalFrames) {
        setCounters({
          farmers: Math.floor(targetValues.farmers * progress),
          acres: Math.floor(targetValues.acres * progress),
          accuracy: Math.floor(targetValues.accuracy * progress),
          crops: Math.floor(targetValues.crops * progress)
        });
      } else {
        clearInterval(timer);
      }
    }, frameRate);
    
    return () => clearInterval(timer);
  }, []);
  
  // Testimonial auto-rotation
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(testimonialInterval);
  }, []);
  
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
    // No need to navigate as we're already on the home page
  };
  
  return (
    <div className={`homepage ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navbar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container">
          <div className="navbar-brand">
            <img src={logo} alt="Logo" width="100" height="100" className="d-inline-block align-top" />
          </div>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded={!isNavCollapsed ? true : false} 
            aria-label="Toggle navigation"
            onClick={handleNavCollapse}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav mx-auto underline-navbar-container">
              <div className={`nav-underline ${slideDirection}`} ref={underlineRef}></div>
              <li className="nav-item">
                <Link className="nav-link active" to="/" ref={activeNavRef}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
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
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1>Predict Crop Yields with Precision</h1>
              <p className="lead">
                Our AI-powered analytics helps farmers and agricultural businesses make data-driven decisions for better crop yields and resource management.
              </p>
              <Link to="/auth" className="btn btn-success btn-lg">Get Started</Link>
            </div>
            <div className="col-md-6">
              <div className="hero-image-container">
                <img 
                  src={heroImage} 
                  alt="AI-powered crop yield prediction" 
                  className="img-fluid rounded hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className={`features-section py-5 ${darkMode ? 'dark-bg' : 'light-bg'}`}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Advanced Features</h2>
            <p className="section-subtitle">Leverage cutting-edge technology for your farm's success</p>
          </div>
          
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className={`feature-card ${darkMode ? 'feature-card-dark' : ''}`}>
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Predictive Analytics</h3>
                <p>Advanced AI algorithms analyze soil, weather, and historical data to predict optimal crop yields.</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className={`feature-card ${darkMode ? 'feature-card-dark' : ''}`}>
                <div className="feature-icon">
                  <i className="fas fa-cloud-sun-rain"></i>
                </div>
                <h3>Weather Integration</h3>
                <p>Real-time weather data integration to adjust predictions based on changing climate conditions.</p>
              </div>
            </div>
            
            <div className="col-md-4 mb-4">
              <div className={`feature-card ${darkMode ? 'feature-card-dark' : ''}`}>
                <div className="feature-icon">
                  <i className="fas fa-seedling"></i>
                </div>
                <h3>Crop Recommendation</h3>
                <p>Get personalized recommendations for crop selection based on your specific soil conditions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h2 className="stat-number">{counters.farmers.toLocaleString()}+</h2>
                <p className="stat-label">Farmers Served</p>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h2 className="stat-number">{counters.acres.toLocaleString()}+</h2>
                <p className="stat-label">Acres Analyzed</p>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h2 className="stat-number">{counters.accuracy}%</h2>
                <p className="stat-label">Prediction Accuracy</p>
              </div>
            </div>
            
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item">
                <h2 className="stat-number">{counters.crops}+</h2>
                <p className="stat-label">Crops Supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className={`how-it-works-section py-5 ${darkMode ? 'dark-bg' : 'light-bg'}`}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple process, powerful results</p>
          </div>
          
          <div className="process-flow">
            <div className="row">
              <div className="col-md-3">
                <div className="process-step">
                  <div className="process-icon">1</div>
                  <h4>Input Data</h4>
                  <p>Enter your field location, soil parameters, and historical information</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="process-step">
                  <div className="process-icon">2</div>
                  <h4>AI Analysis</h4>
                  <p>Our algorithms process your data with weather and market trends</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="process-step">
                  <div className="process-icon">3</div>
                  <h4>Get Predictions</h4>
                  <p>Receive detailed yield predictions and crop recommendations</p>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="process-step">
                  <div className="process-icon">4</div>
                  <h4>Take Action</h4>
                  <p>Implement insights to maximize your harvest and profitability</p>
                </div>
              </div>
            </div>
            <div className="process-connector"></div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="testimonial-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Farmer Success Stories</h2>
            <p className="section-subtitle">Hear from farmers who transformed their yields</p>
          </div>
          
          <div className="testimonial-carousel">
            <div className={`testimonial-slide ${activeTestimonial === 0 ? 'active' : ''}`}>
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"This tool completely changed how I plan my growing season. My wheat yield increased by 28% in the first year of using this platform!"</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <h5>Pramod Gautam</h5>
                    <span>Wheat Farmer, Nitte</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`testimonial-slide ${activeTestimonial === 1 ? 'active' : ''}`}>
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"The crop recommendations were spot-on for my soil conditions. I've never had such a successful harvest of soybeans in 15 years of farming."</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <h5>Subhansh Palekar</h5>
                    <span>Family Farm Owner, Karkala</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`testimonial-slide ${activeTestimonial === 2 ? 'active' : ''}`}>
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <p>"The weather prediction integration saved my crops during an unexpected dry spell. The early warnings gave me time to adjust irrigation and save the season."</p>
                <div className="testimonial-author">
                  <div className="testimonial-author-info">
                    <h5>Harish Dhandev</h5>
                    <span>Corn Producer, Amritsar</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-indicators">
              <span 
                className={activeTestimonial === 0 ? 'active' : ''} 
                onClick={() => setActiveTestimonial(0)}
              ></span>
              <span 
                className={activeTestimonial === 1 ? 'active' : ''} 
                onClick={() => setActiveTestimonial(1)}
              ></span>
              <span 
                className={activeTestimonial === 2 ? 'active' : ''} 
                onClick={() => setActiveTestimonial(2)}
              ></span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Transform Your Farm's Productivity?</h2>
            <p className="lead">Join thousands of farmers who are making data-driven decisions.</p>
            <Link to="/auth" className="btn btn-success btn-lg mt-3">Start Your Free Trial</Link>
          </div>
        </div>
      </section>

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
            <small className="text-muted">Deployed on Vercel</small>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
