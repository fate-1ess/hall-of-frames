"use client";
import { useRevealer } from "@/hooks/useRevealer";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ReactLenis from "lenis/react";

gsap.registerPlugin(SplitText);

const Studio = () => {
  useRevealer();

  useGSAP(() => {
    const splitText = SplitText.create("h2", {
      type: "lines",
      linesClass: "line",
      mask: "lines",
    });

    gsap.set(splitText.lines, { y: "110%" });

    gsap.to(splitText.lines, {
      y: "0%",
      duration: 1.5,
      stagger: 0.1,
      delay: 1.5,
      ease: "power4.out",
    });
  }, {});

  return (
    <>
      <ReactLenis root>
        <div className="revealer"></div>
        <div className="studio">
          <div className="col">
            <h2 className="studio-header">Our Story</h2>
          </div>
          <div className="col">
            <h2>
              At Nuvoro, we believe creativity isn’t just a skill, a mindset.
              Born from a passion for bold ideas and beautifully crafted
              storytelling, we’re a collective of designers, strategists, and
              dreamers who thrive at the intersection of art and innovation.
              Today, we collaborate with visionary clients around the world to
              shape identities,
            </h2>

            <div className="about-img">
              <img
                src="/studio.jpg"
                alt="Team at work in Nuvoro's creative space"
              />
            </div>
          </div>
        </div>
      </ReactLenis>
    </>
  );
};

export default Studio;
