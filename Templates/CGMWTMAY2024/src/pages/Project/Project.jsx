import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../../components/transition/Transition";
import ProjectImg1 from "../../assets/work/img6.jpg";
import ProjectImg2 from "../../assets/work/img5.jpg";
import ProjectImg3 from "../../assets/work/img4.jpg";
import ProjectImg4 from "../../assets/work/img3.jpg";
import ProjectImg5 from "../../assets/work/img2.jpg";
import ProjectImg6 from "../../assets/work/img1.jpg";
import { gsap } from "gsap";

import "./project.css";

const Project = () => {
  useEffect(() => {
    gsap.set(["h1", "p"], {
      y: 50,
      opacity: 0,
    });

    gsap.set(".img", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    setTimeout(() => {
      gsap.to(["h1", "p"], {
        y: 0,
        opacity: 1,
        stagger: 0.075,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".img", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "power4.inOut",
      });
    }, 500);
  }, []);

  return (
    <>
      <div className="project">
        <div className="project-intro">
          <h1>
            Harmony is an immersive digital campaign designed for Sonos,
            coinciding with the launch of their innovative product, 'Ace'—the
            brand's first-ever over-the-ear headphones.
          </h1>
        </div>

        <div className="project-data">
          <div className="project-info">
            <p className="copy-header">About</p>
            <p>
              In addition to developing a digital experience for Ace, we crafted
              a Self-Guided Demo incorporating segmented designs that seamlessly
              synchronize with an audio file provided by Sonos.
            </p>

            <p>
              The Self-Guided Demo aims to transition the site into a dynamic
              and interactive platform that enables inspiration, deep product
              engagement, and educational opportunities.
            </p>

            <br />

            <p className="copy-header">Details</p>
            <ul>
              <li>
                <p>• Interactive Segments</p>
              </li>
              <li>
                <p>• Educational Focus</p>
              </li>
              <li>
                <p>• Immersive Sound Experience</p>
              </li>
            </ul>

            <br />

            <p className="link">
              <Link to="/">Live Demo</Link>
            </p>
          </div>

          <div className="project-images">
            <div className="img">
              <img src={ProjectImg1} alt="" />
            </div>
            <div className="img">
              <img src={ProjectImg2} alt="" />
            </div>
            <div className="img">
              <img src={ProjectImg3} alt="" />
            </div>
            <div className="img">
              <img src={ProjectImg4} alt="" />
            </div>
            <div className="img">
              <img src={ProjectImg5} alt="" />
            </div>
            <div className="img">
              <img src={ProjectImg6} alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className="project-nav">
        <div className="nav-prev">
          <p>
            <span>Previous</span> Harmony
          </p>
          <h1>
            <Link to="/">Previous</Link>
          </h1>
        </div>
        <div className="nav-next">
          <p>
            <span>Next</span> Legacy
          </p>
          <h1>
            <Link to="/">Next</Link>
          </h1>
        </div>
      </div>
    </>
  );
};

export default Transition(Project);
