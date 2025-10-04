import React from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";

import ProjectImage1 from "../../assets/project-images/01.jpg";
import ProjectImage2 from "../../assets/project-images/02.jpg";
import ProjectImage3 from "../../assets/project-images/03.jpg";
import ProjectImage4 from "../../assets/project-images/04.jpg";
import ProjectImage5 from "../../assets/project-images/05.jpg";
import ProjectImage6 from "../../assets/project-images/06.jpg";
import ProjectImage7 from "../../assets/project-images/07.jpg";
import ProjectImage8 from "../../assets/project-images/08.jpg";

import "./SampleProject.css";

const SampleProject = () => {
  return (
    <div className="sameple-project-page">
      <div className="project-info">
        <div className="project-index">
          <p>02</p>
        </div>
        <div className="project-name">
          <p>Neon Galactic Chronicles</p>
        </div>
        <div className="project-duration">
          <p>00' 43'' / 03' 17''</p>
        </div>
        <div className="project-description">
          <p>
            Music video for Eva Sola's new single called Puñal. Tells the story
            of a broken relationship that falls into the abyss through an
            intimate and violent choreography.
          </p>
        </div>
        <div className="project-year">
          <p>2023</p>
        </div>
      </div>

      <div className="whitespace-35vh"></div>

      <div className="project-preview">
        <div className="project-preview-col d-only"></div>
        <div className="project-preview-col">
          <div className="work-video">
            <div className="work-video-wrapper">
              <ReactPlayer
                url={`https://vimeo.com/509236733`}
                controls={false}
                autoPlay={true}
                loop={true}
                playing
                muted
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sample-images">
        <div className="s-row">
          <div className="img">
            <img src={ProjectImage7} alt="" />
          </div>
          <div className="img">
            <img src={ProjectImage8} alt="" />
          </div>
        </div>
        <div className="s-row">
          <div className="img">
            <img src={ProjectImage1} alt="" />
          </div>
        </div>
        <div className="s-row">
          <div className="img">
            <img src={ProjectImage2} alt="" />
          </div>
          <div className="img">
            <img src={ProjectImage3} alt="" />
          </div>
        </div>
        <div className="s-row">
          <div className="img">
            <img src={ProjectImage4} alt="" />
          </div>
        </div>
        <div className="s-row">
          <div className="img">
            <img src={ProjectImage5} alt="" />
          </div>
          <div className="img">
            <img src={ProjectImage6} alt="" />
          </div>
        </div>
      </div>

      <div className="project-nav">
        <div className="link">
          <Link to="/">prev</Link>
        </div>
        <div className="link">
          <Link to="/">next</Link>
        </div>
      </div>
    </div>
  );
};

export default SampleProject;
