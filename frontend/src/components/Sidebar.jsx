import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ darkMode, setDarkMode }) {
  const location = useLocation(); // to highlight active link

  return (
    <div className="sidebar">
      <h2 className="logo">TestCase Generation</h2>
      <nav>
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">Test Case Form</Link>
          </li>
          <li className={location.pathname === "/projects" ? "active" : ""}>
            <Link to="/projects">Projects</Link>
          </li>
          <li className={location.pathname === "/export" ? "active" : ""}>
            <Link to="/export">Export</Link>
          </li>
        </ul>
      </nav>

      <button
        className="toggle-theme"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}

export default Sidebar;
