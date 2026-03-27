"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

function NavLink({ href, className = "", children, onClick, active, activeClassName = "nav-link-current", ...rest }) {
  const pathname = usePathname();
  const isActive = typeof active === "boolean" ? active : pathname === href;
  const classes = `${className} ${isActive ? `active ${activeClassName}` : ""}`.trim();

  return (
    <Link href={href} className={classes} aria-current={isActive ? "page" : undefined} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export default function NavBar() {
  const navbarRef = useRef(null);
  const pathname = usePathname();
  const isGalleryRoute = pathname === "/gallery" || pathname === "/videos";
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

  const handleNavClick = () => {
    handleDropdownClose();
    if (!isCollapsed && navbarRef.current) {
      navbarRef.current.classList.remove("show");
      setIsCollapsed(true);
    }
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
              <NavLink className="nav-link fw-bold" href="/" onClick={handleNavClick}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" href="/About" onClick={handleNavClick}>
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" href="/service" onClick={handleNavClick}>
                Services
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle fw-bold d-flex align-items-center ${isGalleryRoute ? "active nav-link-current" : ""}`}
                type="button"
                id="dropdownGallery"
                aria-expanded={isDropdownOpen}
                onClick={handleDropdownToggle}
                style={{ background: "transparent", border: 0 }}
              >
                Gallery
              </button>
              <ul className={`dropdown-menu${isDropdownOpen ? " show" : ""}`} aria-labelledby="dropdownGallery">
                <li>
                  <NavLink className="dropdown-item" href="/gallery" style={{ fontWeight: "bold" }} onClick={handleNavClick}>
                    Photos
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" href="/videos" style={{ fontWeight: "bold" }} onClick={handleNavClick}>
                    Videos
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" href="/Team" onClick={handleNavClick}>
                Team
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" href="/contact" onClick={handleNavClick}>
                Contact
              </NavLink>
            </li>
          </ul>
          <NavLink className="grievance" href="/grievance" onClick={handleNavClick} activeClassName="button-link-current">
            Grievance
          </NavLink>
          {/* <a className="getstarted" href="/login">
            Admin Login
          </a> */}
          <a className="getstarted" href="http://wbpms.in/citizen" target="_blank" rel="noopener noreferrer">
            Citizen Services
          </a>
        </div>
      </div>
    </nav>
  );
}
