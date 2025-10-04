import React from "react";
import { Link } from "react-router-dom";

import "./Nav.css";

const Nav = () => {
  return (
    <div className="nav">
      <div className="logo">
        <Link to="/">Unusual Designs</Link>
      </div>
      <div className="nav-items">
        <div className="nav-item">
          <Link to="/">• Home</Link>
        </div>
        <div className="nav-item">
          <Link to="/projects">• Portfolio</Link>
        </div>
        <div className="nav-item">
          <Link to="/about">• About Us</Link>
        </div>
        <div className="nav-item">
          <Link to="/careers">• Careers</Link>
        </div>
        <div className="nav-item">
          <Link to="/contact">• Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;
