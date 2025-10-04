"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import Marquee from "@/components/Marquee/Marquee";
import Footer from "@/components/Footer/Footer";
import ShuffleText from "@/components/ShuffleText/ShuffleText";
import { resolveAssetPath } from "@/utils/base-path";

import "./archive.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const ArchivePage = () => {
  const container = useRef();

  // controls pinning of the source section
  useGSAP(
    () => {
      let pinAnimation;

      const initPinning = () => {
        if (pinAnimation) {
          pinAnimation.kill();
        }

        if (window.innerWidth > 900) {
          pinAnimation = ScrollTrigger.create({
            trigger: ".sticky-archive",
            start: "top top",
            endTrigger: ".gallery",
            end: "bottom bottom",
            pin: ".source",
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        }
      };

      initPinning();

      const handleResize = () => {
        initPinning();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        if (pinAnimation) {
          pinAnimation.kill();
        }
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: container }
  );

  return (
    <ReactLenis root>
      <div className="archive" ref={container}>
        <section className="archive-hero">
          <div className="container">
            <ShuffleText
              as="h1"
              text="Archive 101: Starlight Reverie Celestial"
            />
            <div className="archive-hero-img-wrapper">
              <div className="archive-hero-img-wrapper-row">
                <p>+</p>
                <p>+</p>
                <p>+</p>
              </div>
              <div className="archive-hero-img-wrapper-row">
                <div className="archive-hero-img">
                  <img
                    src={resolveAssetPath("images/carousel/carousel1.jpeg")}
                    alt=""
                  />
                </div>
              </div>
              <div className="archive-hero-img-wrapper-row">
                <p>+</p>
                <p>+</p>
                <p>+</p>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky-archive">
          <div className="archive-col source">
            <div className="container">
              <div className="source-img">
                <img
                  src={resolveAssetPath("images/home/prompt-eg-1.jpeg")}
                  alt=""
                />
              </div>
              <div className="source-content">
                <p className="primary">[ Original Source ]</p>
                <h4>Gazing into the distance </h4>
              </div>
            </div>
          </div>
          <div className="archive-col gallery">
            <div className="container">
              <div className="gallery-copy">
                <p className="primary">
                  // PROMPT: A surrealist portrait of an enigmatic figure,
                  bathed in moody lighting, gazing into the distance with an air
                  of mystery.
                </p>
                <p className="secondary">[ AI Character ]</p>
                <h4>Midjourney</h4>
                <div className="gallery-images-container">
                  <div className="gallery-row main-img">
                    <img
                      src={resolveAssetPath("images/home/prompt-eg-2.jpeg")}
                      alt=""
                    />
                  </div>
                  <div className="gallery-row sub-images">
                    <div className="sub-images-col">
                      <img
                        src={resolveAssetPath("images/home/prompt-1.jpeg")}
                        alt=""
                      />
                    </div>
                    <div className="sub-images-col">
                      <img
                        src={resolveAssetPath("images/home/prompt-2.jpeg")}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="next-archive">
          <div className="next-archive-bg"></div>
          <div className="marquee-archive">
            <Marquee />
          </div>
          <div className="container">
            <p className="primary">[ Archive 102 ]</p>
            <div className="next-archive-img">
              <img
                src={resolveAssetPath("images/carousel/carousel2.jpeg")}
                alt=""
              />
            </div>
            <h2>The Infinite Eternity Flow</h2>
          </div>
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default ArchivePage;
