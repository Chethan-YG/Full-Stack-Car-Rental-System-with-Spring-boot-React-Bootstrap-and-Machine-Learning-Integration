import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthData } from "../utils/auth";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    clearAuthData(navigate);
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const navItems = [
    { path: "/home", label: "HOME", roles: ["CUSTOMER", "ADMIN"] },
    { path: "/dashboard", label: "DASHBOARD", roles: ["CUSTOMER", "ADMIN"] },
    { path: "/car", label: "CAR", roles: ["ADMIN"] },
    { path: "/drive", label: "DRIVE ASSIST", roles: ["CUSTOMER", "ADMIN"] },
    { path: "/bookings", label: "BOOKINGS", roles: ["CUSTOMER", "ADMIN"] },
    { path: "/damage", label: "DAMAGE CHECK", roles: [ "ADMIN"] },
    { path: "/search", label: "SEARCH", roles: ["CUSTOMER", "ADMIN"] },
    {
      path: "#",
      label: "LOGOUT",
      roles: ["CUSTOMER", "ADMIN"],
      action: (navigate) => {
        handleLogout(navigate);
      },
    },
  ];

  const unauthenticatedNavItems = [
    { path: "/login", label: "LOGIN" },
    { path: "/signup", label: "SIGN UP" },
  ];

  const filteredNavItems = isAuthenticated
    ? navItems.filter((item) => item.roles.includes(userRole))
    : unauthenticatedNavItems;

  return (
    <header>
      <nav className={`navbar navbar-expand-lg navbar-light bg-white fixed-top shadow py-0 my-0 ${isOpen ? "navbar-open" : ""}`}>
        <div className="container-fluid ps-0 my-3">
          <div className="d-flex align-items-center">
            <div className="navbar-brand ps-3">
              <img
                src="https://i.postimg.cc/FRRBMB3H/QuickCar.png"
                alt="Profile Pic"
                width="50"
                height="50"
                className="d-inline-block align-text-top rounded-circle"
              />
            </div>
            <div className="mylogo ps-2 fw-bold">
              <span>QUICK</span>CAR
            </div>
          </div>
          <button
            className="navbar-toggler border-0 collapsed pe-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleNavbar}
            onFocus={(e) => e.target.blur()}
          >
            <span>
              <i className={`bi me-0 ${isOpen ? "bi-x" : "bi-list"}`} style={{ fontSize: '2.5rem' }}></i>
            </span>
          </button>

          <div className={`collapse navbar-collapse mt-2 justify-content-end w-100 ${isOpen ? "show" : ""}`} id="navbarNavDropdown">
            <ul className="navbar-nav">
              {filteredNavItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link to={item.path} className="nav-link" onClick={item.action}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
