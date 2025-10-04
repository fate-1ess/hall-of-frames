import React from "react";
import ReactPlayer from "react-player";
import Footer from "../footer/Footer";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-video">
        <ReactPlayer
          url="https://vimeo.com/509236733"
          controls={false}
          autoPlay={true}
          playing
          muted
          width="100%"
          height="100%"
        />
      </div>
      <div className="footer-bottom">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
