import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className="dark-mode-toggle">
      <input
        type="checkbox"
        className="dark-mode-checkbox"
        id="darkmode-toggle"
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <label className="dark-mode-label" htmlFor="darkmode-toggle">
        <i className="fa fa-moon"></i>
        <i className="fa fa-sun"></i>
        <div className="dark-mode-ball"></div>
      </label>
    </div>
  );
};

export default DarkModeToggle;