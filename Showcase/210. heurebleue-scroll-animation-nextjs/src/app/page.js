"use client";
import React from "react";
import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

import ReactLenis from "@studio-freight/react-lenis";

export default function Home() {
  const container = useRef();
  const galleryWrapperRef = useRef(null);
  const mainImgRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: ".ws",
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const galleryWrapper = galleryWrapperRef.current;
          const sideCols = document.querySelectorAll(".col:not(.main)");
          const mainImg = mainImgRef.current;

          const screenWidth = window.innerWidth;
          const maxScale = screenWidth < 900 ? 4 : 2.65;

          const scale = 1 + self.progress * maxScale;
          const yTranslate = self.progress * 300;
          const mainImgScale = 2 - self.progress * 0.85;

          if (galleryWrapper) {
            galleryWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
          }

          sideCols.forEach((col) => {
            col.style.transform = `translateY(${yTranslate}px)`;
          });

          if (mainImg) {
            mainImg.style.transform = `scale(${mainImgScale})`;
          }
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <>
      <ReactLenis root>
        <section className="sticky">
          <div className="gallery-wrapper" ref={galleryWrapperRef}>
            <div className="col side-1">
              <div className="img">
                <img src="/img1.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img2.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img3.jpg" alt="" />
              </div>
            </div>

            <div className="col side-2">
              <div className="img">
                <img src="/img4.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img5.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img6.jpg" alt="" />
              </div>
            </div>

            <div className="col main">
              <div className="img">
                <img src="/img7.jpg" alt="" />
              </div>
              <div className="img main">
                <img src="/img8.jpg" alt="" ref={mainImgRef} />
              </div>
              <div className="img">
                <img src="/img9.jpg" alt="" />
              </div>
            </div>

            <div className="col side-3">
              <div className="img">
                <img src="/img10.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img11.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img12.jpg" alt="" />
              </div>
            </div>

            <div className="col side-4">
              <div className="img">
                <img src="/img1.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img2.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/img3.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>

        <div className="container" ref={container}>
          <section className="hero">
            <div className="hero-img">
              <img src="/hero.jpg" alt="" />
            </div>
            <div className="header">
              <h1>serene</h1>
              <h1>drift</h1>
            </div>
          </section>

          <section className="intro">
            <div className="tagline">
              <p>Inspired visuals for creators of calm and beauty</p>
            </div>
            <div className="divider"></div>
            <div className="intro-header">
              <h1>elevating</h1>
              <h1>serenity</h1>
            </div>
          </section>

          <section className="ws"></section>

          <section className="outro">
            <h1>crafted calm</h1>
            <h1>and beauty</h1>
          </section>

          <section className="footer">
            <div className="footer-bg">
              <img src="/footer.jpg" alt="" />
            </div>
          </section>
        </div>
      </ReactLenis>
    </>
  );
}
