"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import "./home.css";
import Footer from "./components/Footer/Footer";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";
import { useWithBasePath } from "./lib/basePath";

let isInitialLoad = true;

export default function Home() {
  const containerRef = useRef(null);
  const preloaderRef = useRef(null);
  const progressBarRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const hasAnimatedHero = useRef(false);
  const withBasePath = useWithBasePath();

  useLayoutEffect(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      "hop-main",
      "M0,0 C0.354,0 0.464,0.133 0.498,0.502 0.532,0.872 0.651,1 1,1"
    );
  }, []);

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useGSAP(
    () => {
      if (showPreloader) {
        const tl = gsap.timeline({
          onComplete: () => setShowPreloader(false),
        });

        tl.to(progressBarRef.current, {
          scaleX: 1,
          duration: 4,
          ease: "power1.inOut",
        });

        tl.set(progressBarRef.current, { transformOrigin: "right" }).to(
          progressBarRef.current,
          {
            scaleX: 0,
            duration: 1,
            ease: "power2.in",
          }
        );

        tl.to(preloaderRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.5,
          ease: "hop-main",
        });
      }

      if (!hasAnimatedHero.current) {
        gsap.set(".hero-title .line h1", { y: 70 });
        gsap.to(".hero-title .line h1", {
          y: 0,
          stagger: 0.1,
          delay: showPreloader ? 5.75 : 1,
          duration: 1.5,
          ease: "power4.out",
        });
        hasAnimatedHero.current = true;
      }
    },
    { scope: containerRef }
  );

  return (
    <>
      {showPreloader && (
        <div className="pre-loader" ref={preloaderRef}>
          <div className="progress-bar" ref={progressBarRef}></div>
        </div>
      )}
      <div className="home-page" ref={containerRef}>
        <div className="hero-img">
          <Image
            src={withBasePath("/home/hero-img.jpg")}
            alt="Young woman standing in a sunlit interior"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="hero-title">
          <div className="line">
            <h1>An independent developer</h1>
          </div>
          <div className="line">
            <h1>based in Toronto</h1>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
