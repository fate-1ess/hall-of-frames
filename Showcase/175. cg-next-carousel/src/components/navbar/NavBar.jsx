import React from "react";

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <p>
          <span>Directory</span> by Codegrid
        </p>
      </div>
      <div className="nav-links">
        <p>Home</p>
        <p>Projects</p>
        <p>Use Cases</p>
        <p>Commitments</p>
      </div>
      <div className="cta">
        <p>Contact</p>
      </div>
    </div>
  );
};

export default NavBar;
