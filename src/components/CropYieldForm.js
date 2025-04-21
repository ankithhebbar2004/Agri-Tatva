import React, { useState, useContext } from 'react';
import axios from 'axios';
import areaOptions from '../data/areaOptions';
import itemOptions from '../data/itemOptions';
import backgroundImage from '../backgroundimage.jpg';
import './CropYieldForm.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MetricsSlideshow from './MetricsSlideshow/MetricsSlideshow';

function CropYieldForm({ goToHome }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Year: 2013,
    average_rain_fall_mm_per_year: '',
    pesticides_tonnes: '',
    avg_temp: '',
    Area: '',
    Item: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMetricsSlideshow, setShowMetricsSlideshow] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Get user info from localStorage
    let user_id = null;
    let email = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user_id = user.user_id;
        email = user.email;
      }
    } catch (err) {
      console.error('Error getting user data from localStorage', err);
    }
    
    try {
      // Include user_id with the prediction request
      const requestData = {
        ...formData,
        user_id: user_id,
        email: email
      };
      
      const response = await axios.post('http://localhost:5000/predict', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setPrediction(response.data.prediction[0][0]);
    } catch (err) {
      setError('Error occurred while making prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const renderPredictionResults = () => {
    if (prediction !== null) {
      return (
        <div className="results-section">
          <h3>Prediction Results</h3>
          <div className="results-content">
            <div className="result-card">
              <div className="result-value">{prediction.toFixed(2)}</div>
              <div className="result-label">Predicted Yield (hg/ha)</div>
            </div>
            <div className="result-card">
              <div className="result-value">{(prediction / 100).toFixed(2)}</div>
              <div className="result-label">Tonnes per Hectare</div>
            </div>
          </div>
          <button 
            className="metrics-button"
            onClick={() => setShowMetricsSlideshow(true)}
          >
            View Performance Metrics
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="form-container" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="crop-yield-container">
        <div className="header-actions">
          <button className="home-button btn btn-outline-secondary mb-3" onClick={goToHome}>Back to Home</button>
          <button className="logout-button btn btn-outline-danger mb-3 ms-2" onClick={handleLogout}>Sign Out</button>
        </div>
        
        <div className="form-header">
          <h2>Crop Yield Prediction</h2>
          <p>Fill in the details below to predict crop yield</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="Year">Year</label>
              <input
                type="number"
                className="form-control"
                id="Year"
                name="Year"
                value={formData.Year}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="average_rain_fall_mm_per_year">Average Rainfall (mm/year)</label>
              <input
                type="number"
                className="form-control"
                id="average_rain_fall_mm_per_year"
                name="average_rain_fall_mm_per_year"
                value={formData.average_rain_fall_mm_per_year}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pesticides_tonnes">Pesticides (Tonnes)</label>
              <input
                type="number"
                className="form-control"
                id="pesticides_tonnes"
                name="pesticides_tonnes"
                value={formData.pesticides_tonnes}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="avg_temp">Average Temperature</label>
              <input
                type="number"
                className="form-control"
                id="avg_temp"
                name="avg_temp"
                value={formData.avg_temp}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="Area">Area</label>
              <select
                className="form-control"
                id="Area"
                name="Area"
                value={formData.Area}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Area</option>
                {areaOptions.map((area, index) => (
                  <option key={index} value={area}>{area}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="Item">Item</label>
              <select
                className="form-control"
                id="Item"
                name="Item"
                value={formData.Item}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Item</option>
                {itemOptions.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-submit">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Predicting...' : 'Predict Yield'}
            </button>
          </div>
        </form>
        
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        
        {renderPredictionResults()}
        
        <MetricsSlideshow 
          isOpen={showMetricsSlideshow} 
          onClose={() => setShowMetricsSlideshow(false)} 
        />
      </div>
    </div>
  );
}

export default CropYieldForm;
