import React, { useEffect } from "react";
import Transition from "../../components/transition/Transition";
import IntroImg from "../../assets/home/intro.jpg";
import { gsap } from "gsap";

import "./home.css";

const Home = () => {
  const splitHeader = (selector) => {
    let elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      let text = element.innerText;
      let splitText = text
        .split("")
        .map(function (char) {
          return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
        })
        .join("");

      element.innerHTML = splitText;
    });
  };

  useEffect(() => {
    splitHeader(".header-1 h1");
    splitHeader(".header-2 h1");

    gsap.set("p", {
      y: 50,
      opacity: 0,
    });

    gsap.set(".intro-img", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });

    setTimeout(() => {
      gsap.to([".header-1 h1 span", ".header-2 h1 span"], {
        top: "0px",
        stagger: 0.015,
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.to("p", {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(".intro-img", {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1,
        ease: "power4.inOut",
        delay: 0.25,
      });
    }, 500);
  }, []);
  return (
    <>
      <div className="header">
        <div className="header-1">
          <h1>Alejandro Ortiz</h1>
        </div>
        <div className="header-2">
          <h1>Visual Dev</h1>
        </div>
      </div>
      <div className="intro">
        <div className="intro-col">
          <div className="intro-sub-col">
            <p className="intro-header">About</p>
            <p>Read More</p>
            <br />
            <p className="intro-header">Contact</p>
            <p>Email Address</p>
          </div>
          <div className="intro-sub-col">
            <p className="intro-header">Social</p>
            <p>Instagram</p>
            <p>Savee</p>
            <p>LinkedIn</p>
          </div>
        </div>
        <div className="intro-col">
          <div className="intro-img">
            <img src={IntroImg} alt="Alejandro Ortiz" />
          </div>
          <div className="intro-about">
            <div className="intro-about-col">
              <p>
                Hi, I'm Alejandro Ortiz—a passionate visual developer and
                designer based in Miami. My journey in design revolves around
                creating compelling visuals and immersive digital experiences.
              </p>
            </div>
            <div className="intro-about-col">
              <p>
                With over six years in the field, my expertise spans from
                innovative UI/UX solutions to dynamic visual storytelling,
                helping brands stand out in the digital landscape.
              </p>
            </div>
          </div>
          <div className="intro-data">
            <p className="intro-header">Clients</p>
            <p>
              Apple, Spotify, Nike, Amazon, Adobe, Tesla, Microsoft, Uber,
              Peloton, Samsung, Airbnb, LEGO, BBC, Red Bull.
            </p>

            <br />

            <p className="intro-header">Senior Visual Designer - ThinkMotive</p>
            <p>March 2022 - Current</p>

            <br />

            <p className="intro-header">Lead Designer - Creative Labs</p>
            <p>June 2018 - March 2022</p>

            <br />

            <p className="intro-header">Graphic Designer - MediaMonks</p>
            <p>April 2015 - June 2018</p>

            <br />

            <p className="intro-header">Recognition</p>
            <p>Awwwards Site of the Day - Horizon UI</p>
            <p>Featured on CSS Design Awards - Horizon UI</p>
            <p>Cannes Lions, Silver, Digital Craft - NextGen Retail</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transition(Home);
