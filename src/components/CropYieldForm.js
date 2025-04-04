import React, { useState } from 'react';
import axios from 'axios';
import areaOptions from '../data/areaOptions';
import itemOptions from '../data/itemOptions';

const CropYieldForm = () => {
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
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
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

  return (
    <div className="custom-box" id="prediction-box">
      <h2 className="text-center mb-4 custom-subheading">Input All Features Here</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Year" className="form-label">Year</label>
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
        
        <div className="mb-3">
          <label htmlFor="average_rain_fall_mm_per_year" className="form-label">Average Rainfall (mm/year)</label>
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
        
        <div className="mb-3">
          <label htmlFor="pesticides_tonnes" className="form-label">Pesticides (Tonnes)</label>
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
        
        <div className="mb-3">
          <label htmlFor="avg_temp" className="form-label">Average Temperature</label>
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
        
        <div className="mb-3">
          <label htmlFor="Area" className="form-label">Area</label>
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
        
        <div className="mb-3">
          <label htmlFor="Item" className="form-label">Item</label>
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
        
        <button 
          type="submit" 
          className="btn btn-primary btn-lg btn-predict"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      
      {prediction !== null && (
        <div className="prediction-result mt-4">
          <h2>Predicted Yield:</h2>
          <h1>{prediction.toFixed(2)}</h1>
        </div>
      )}
    </div>
  );
};

export default CropYieldForm;
