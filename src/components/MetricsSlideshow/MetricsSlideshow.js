import React, { useState, useEffect } from 'react';
import './MetricsSlideshow.css';

// Import metrics images
import metric1 from '../assets/actual_vs_predicted_comparison.png';
import metric2 from '../assets/dtr_learning_curve.png';
import metric3 from '../assets/knn_learning_curve.png';
// Add more imports as needed based on your actual metric images

const MetricsSlideshow = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const metricsImages = [
    { src: metric1, alt: "Metric 1" },
    { src: metric2, alt: "Metric 2" },
    { src: metric3, alt: "Metric 3" },
    // Add more metric images as needed
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === metricsImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? metricsImages.length - 1 : prevIndex - 1
    );
  };

  // Close the slideshow when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="metrics-slideshow-overlay">
      <div className="metrics-slideshow-container">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="slideshow-content">
          <img 
            src={metricsImages[currentIndex].src} 
            alt={metricsImages[currentIndex].alt}
            className="metrics-image"
          />
          <div className="image-counter">
            {currentIndex + 1}/{metricsImages.length}
          </div>
        </div>
        
        <div className="slideshow-controls">
          <button onClick={prevSlide} className="slideshow-control-btn">Previous</button>
          <button onClick={nextSlide} className="slideshow-control-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default MetricsSlideshow;
