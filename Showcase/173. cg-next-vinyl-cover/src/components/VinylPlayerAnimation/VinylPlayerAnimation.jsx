"use client";

import { useEffect, useRef } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);
gsap.registerPlugin(useGSAP);

const DISK_IMAGE_SRC = "/disk.png";

const VinylCoverAnimation = ({ textsPrimary, textSecondary, coverImg }) => {
  const container = useRef();

  useEffect(() => {
    document
      .getElementById("def-1")
      .setAttribute("d", document.getElementById("path-1").getAttribute("d"));

    document
      .getElementById("def-2")
      .setAttribute("d", document.getElementById("path-2").getAttribute("d"));
  }, []);

  useGSAP(
    () => {
      const animateText = (selector, delay) => {
        gsap.to(selector, {
          attr: { startOffset: "100%" },
          ease: "linear",
          duration: 6,
          repeat: -1,
          delay: delay,
        });
      };

      animateText("#Text1", 0);
      animateText("#Text2", 2);
      animateText("#Text3", 4);

      gsap.to(".disk", {
        rotate: 360,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
    },
    { scope: container }
  );

  return (
    <div className="container" ref={container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 350 350"
        width="800px"
        height="600px"
        id="text-primary"
      >
        <defs>
          <path id="def-1" />
        </defs>
        <path
          id="path-1"
          d="M -393 405 C -53 405 -73 5 177 5 C 427 5 407 405 747 405"
        />
        <text>
          {textsPrimary.map((text, index) => (
            <textPath
              key={index}
              id={`Text${index + 1}`}
              xlinkHref="#def-1"
              startOffset="-25%"
            >
              {text}
            </textPath>
          ))}
        </text>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="600px"
        height="600px"
        viewBox="0 0 350 350"
        id="text-secondary"
      >
        <defs>
          <path id="def-2" />
        </defs>
        <path
          id="path-2"
          d="M -393 60 C -53 60 -70 365 180 365 C 421 352 407 60 725 56"
        />
        <text x="50%" y="50%" dominantBaseline="end" textAnchor="middle">
          <textPath id="Text5" xlinkHref="#def-2" startOffset="37%">
            {textSecondary}
          </textPath>
        </text>
      </svg>

      <div className="disk">
        <img src={DISK_IMAGE_SRC} alt="Vinyl record" />
        <div className="cover-img">
          <img src={coverImg} alt="Album cover" />
        </div>
      </div>
    </div>
  );
};

export default VinylCoverAnimation;
