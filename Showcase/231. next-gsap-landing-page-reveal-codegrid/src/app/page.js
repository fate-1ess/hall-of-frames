"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(CustomEase);

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const resolveAsset = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
};

export default function Home() {
  const container = useRef();
  const customEase = CustomEase.create("custom", ".87,0,.13,1");

  useGSAP(
    () => {
      if (typeof window === "undefined") {
        return;
      }

      let started = false;
      const root = container.current ?? document;
      const heroElement =
        container.current ?? root.querySelector?.(".hero") ?? null;

      const startAnimation = () => {
        if (started) return;
        started = true;

        const counter = root.querySelector("#counter");
        const videoContainer = root.querySelector(".video-container");
        const progressBar = root.querySelector(".progress-bar");
        const logo = document.querySelector(".logo");
        const animOutChars = document.querySelectorAll(".char.anim-out h1");
        const animInChars = document.querySelectorAll(".char.anim-in h1");
        const headerSpans = root.querySelectorAll(".header span");
        const coordinatesSpans = root.querySelectorAll(".coordinates span");

        if (videoContainer) {
          gsap.set(videoContainer, {
            scale: 0,
            rotation: -20,
          });
        }

        if (heroElement) {
          gsap.to(heroElement, {
            clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
            duration: 1.5,
            ease: customEase,
            delay: 1,
          });

          gsap.to(heroElement, {
            clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
            duration: 2,
            ease: customEase,
            delay: 3,
            onStart: () => {
              if (progressBar && counter) {
                gsap.to(progressBar, {
                  width: "100vw",
                  duration: 2,
                  ease: customEase,
                });

                gsap.to(counter, {
                  innerHTML: 100,
                  duration: 2,
                  ease: customEase,
                  snap: { innerHTML: 1 },
                });
              }
            },
          });

          gsap.to(heroElement, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: customEase,
            delay: 5,
            onStart: () => {
              if (videoContainer) {
                gsap.to(videoContainer, {
                  scale: 1,
                  rotation: 0,
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  duration: 1.25,
                  ease: customEase,
                });
              }

              if (progressBar) {
                gsap.to(progressBar, {
                  opacity: 0,
                  duration: 0.3,
                });
              }

              if (logo) {
                gsap.to(logo, {
                  left: "0%",
                  transform: "translateX(0%)",
                  duration: 1.25,
                  ease: customEase,
                  onStart: () => {
                    if (animOutChars.length > 0) {
                      gsap.to(animOutChars, {
                        y: "100%",
                        duration: 1,
                        stagger: -0.075,
                        ease: customEase,
                      });
                    }

                    if (animInChars.length > 0) {
                      gsap.to(animInChars, {
                        x: "-1200%",
                        duration: 1,
                        ease: customEase,
                        delay: 0.25,
                      });
                    }
                  },
                });
              }
            },
          });
        }

        const spans = [...headerSpans, ...coordinatesSpans];
        if (spans.length > 0) {
          gsap.to(spans, {
            y: "0%",
            duration: 1,
            stagger: 0.125,
            ease: "power3.out",
            delay: 5.75,
          });
        }
      };

      const handleLoad = () => startAnimation();

      if (document.readyState === "complete") {
        startAnimation();
      } else {
        window.addEventListener("load", handleLoad);
      }

      return () => {
        window.removeEventListener("load", handleLoad);
      };
    },
    { scope: container, dependencies: [] }
  );

  return (
    <>
      <div className="hero" ref={container}>
        <div className="progress-bar">
          <p>loading</p>
          <p>
            /<span id="counter">0</span>
          </p>
        </div>

        <div className="video-container">
          <video autoPlay loop muted playsInline>
            <source src={resolveAsset("/video.mp4")} type="video/mp4" />
          </video>
        </div>

        <nav>
          <p>&#9679;</p>
          <p>&#9679;</p>
        </nav>

        <footer>
          <p>ufc</p>
          <p>podcasts</p>
          <p>betting</p>
          <p>rankings</p>
          <p>news</p>
        </footer>

        <div className="header">
          <h1>
            <span>Combat from</span>
          </h1>
          <h1>
            <span>the streets of</span>
          </h1>
          <h1>
            <span>Kansas</span>
          </h1>
          <p>
            <span>( watch the fight )</span>
          </p>
        </div>

        <div className="coordinates">
          <p>
            <span>37.6934° N</span>
          </p>
          <p>
            <span>97.3382° W</span>
          </p>
        </div>
      </div>

      <div className="logo">
        <div className="char">
          <h1>C</h1>
        </div>
        <div className="char anim-out">
          <h1>l</h1>
        </div>
        <div className="char anim-out">
          <h1>a</h1>
        </div>
        <div className="char anim-out">
          <h1>s</h1>
        </div>
        <div className="char anim-out">
          <h1>h</h1>
        </div>
        <div className="char anim-out">
          <h1>o</h1>
        </div>
        <div className="char anim-out">
          <h1>n</h1>
        </div>
        <div className="char anim-in">
          <h1>.</h1>
        </div>
      </div>
    </>
  );
}
