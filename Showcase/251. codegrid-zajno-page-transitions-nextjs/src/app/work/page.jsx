"use client";
import { useRevealer } from "@/hooks/useRevealer";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ReactLenis from "lenis/react";

gsap.registerPlugin(SplitText);

const Work = () => {
  useRevealer();

  useGSAP(() => {
    const splitText = SplitText.create("h1", {
      type: "words",
      wordsClass: "word",
      mask: "words",
    });

    gsap.set(splitText.words, { y: "110%" });

    gsap.to(splitText.words, {
      y: "0%",
      duration: 1.5,
      stagger: 0.25,
      delay: 1.75,
      ease: "power4.out",
    });
  }, {});

  return (
    <>
      <ReactLenis root>
        <div className="revealer"></div>
        <div className="work">
          <h1>selected work</h1>

          <div className="projects">
            <img src="/img1.jpg" alt="" />
            <img src="/img2.jpg" alt="" />
            <img src="/img3.jpg" alt="" />
            <img src="/img4.jpg" alt="" />
          </div>
        </div>
      </ReactLenis>
    </>
  );
};

export default Work;
