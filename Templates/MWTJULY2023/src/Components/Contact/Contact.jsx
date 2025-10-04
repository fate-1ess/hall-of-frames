import React, { useRef } from "react";

import { LocomotiveScrollProvider } from "react-locomotive-scroll";

import transition from "../transition";

import "./Contact.css";

const Contact = () => {
  const containerRef = useRef(null);

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      }}
      watch={[]}
      containerRef={containerRef}
    >
      <section
        className="contact"
        data-scroll-container
        ref={containerRef}
        id="scroll-container"
      >
        <div className="contact-copy" data-scroll-section>
          <span>Project Inquires</span>
          <br />
          <br />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores,
            nam?
          </p>
          <br />
          <a href="#">contact@boring.studio</a>
          <br />
          <br />
          <br />
          <p>Opening times : Mon–Fri, 10–18</p>
          <br />
          <br />
          <span>Networks</span>
          <br />
          <br />
          <a href="#">Twitter</a>
          <br />
          <a href="#">Instagram</a>
          <br />
          <a href="#">LinkedIn</a>
          <br />
          <br />
          <br />
          <span>Our Workplace</span>
          <br />
          <br />
          <p>Toronto 0982</p>
          <p>0912 King street</p>
          <p>Toronto CA</p>
          <br />
          <span id="copyright">
            Unusual Designs is a creative studio <br /> Toronto, CA © 2023 ALL
            RIGHTS RESERVED.
          </span>
        </div>
      </section>
    </LocomotiveScrollProvider>
  );
};

export default transition(Contact);
