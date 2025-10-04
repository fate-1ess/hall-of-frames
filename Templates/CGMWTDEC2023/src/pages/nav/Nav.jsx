import React from "react";
import { Link } from "react-router-dom";

import "./Nav.css";

const Nav = () => {
  return (
    <div className="nav">
      <div className="logo">
        <div className="nav-item">
          <Link to="/">velasco solari</Link>
        </div>
      </div>
      <div className="links">
        <div className="nav-item">
          <Link to="/work">work</Link>
        </div>
        <div className="nav-item">
          <Link to="/overview">overview</Link>
        </div>
        <div className="nav-item">
          <Link to="/mustang">mustang</Link>
        </div>
        <div className="nav-item">
          <Link to="/info">info</Link>
        </div>
      </div>
    </div>
  );
};

export default Nav;
