import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-item">
        <p>represented by none</p>
        <p>utopia@nuance.tv</p>
        <p>34 21 2323 2323</p>
      </div>
      <div className="footer-item footer-links">
        <Link to="/">instagram</Link>
        <Link to="/">vimeo</Link>
      </div>
    </div>
  );
};

export default Footer;
