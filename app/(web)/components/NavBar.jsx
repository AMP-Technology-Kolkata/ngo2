"use client";
import { useRef, useState, useEffect } from "react";

export default function NavBar() {
  const navbarRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggle = () => {
    if (isCollapsed) {
      navbarRef.current.classList.add("show");
    } else {
      navbarRef.current.classList.remove("show");
    }
    setIsCollapsed(!isCollapsed);
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top navcontent" style={{ backgroundColor: "#192f59" }}>
      <div className="container">
        <button
          className="navbar-toggler ms-auto"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={handleToggle}
          style={{ backgroundColor: "white" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`} id="navbarSupportedContent" ref={navbarRef}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active fw-bold" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-bold" href="/About">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-bold" href="/service">
                Services
              </a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle fw-bold" href="#" role="button" id="dropdownGallery" aria-expanded={isDropdownOpen} onClick={handleDropdownToggle}>
                Gallery
              </a>
              <ul className={`dropdown-menu${isDropdownOpen ? " show" : ""}`} aria-labelledby="dropdownGallery">
                <li>
                  <a className="dropdown-item" href="/gallery" style={{ fontWeight: "bold" }} onClick={handleDropdownClose}>
                    Photos
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/videos" style={{ fontWeight: "bold" }} onClick={handleDropdownClose}>
                    Videos
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-bold" href="/Team">
                Team
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-bold" href="/contact">
                Contact
              </a>
            </li>
          </ul>
          <a className="grievance" href="/grievance">
            Grievance
          </a>
          {/* <a className="getstarted" href="/login">
            Admin Login
          </a> */}
          <a className="getstarted" href="http://wbpms.in/citizen" target="_blank">
            Citizen Services
          </a>
        </div>
      </div>
    </nav>
  );
}
