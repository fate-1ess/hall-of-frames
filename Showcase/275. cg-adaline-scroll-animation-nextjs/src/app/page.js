"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { withBasePath } from "@/utils/base-path";

export default function Home() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const navRef = useRef(null);
  const headerRef = useRef(null);
  const heroImgRef = useRef(null);
  const contextRef = useRef(null);
  const imagesRef = useRef([]);
  const videoFramesRef = useRef({ frame: 0 });
  const lenisRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger, useGSAP);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      contextRef.current = context;

      const setCanvasSize = () => {
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        context.scale(pixelRatio, pixelRatio);
      };

      setCanvasSize();

      const frameCount = 207;
      const framePath = (index) =>
        withBasePath(
          `/frames/frame_${(index + 1).toString().padStart(4, "0")}.jpg`
        );

      let images = [];
      let framesLoaded = 0;
      let framesRemaining = frameCount;
      let hasInitialized = false;

      const finalizeInitialization = () => {
        if (!hasInitialized && (framesLoaded > 0 || framesRemaining === 0)) {
          hasInitialized = true;
          render();
          setupScrollTrigger();
        } else if (hasInitialized && framesRemaining === 0) {
          ScrollTrigger.refresh();
        }
      };

      const markFrameSettled = (didLoad) => {
        if (didLoad) {
          framesLoaded += 1;
        }
        framesRemaining -= 1;
        finalizeInitialization();
      };

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.decoding = "async";
        if (i === 0) {
          img.fetchPriority = "high";
        }
        img.onload = () => markFrameSettled(true);
        img.onerror = () => markFrameSettled(false);
        img.src = framePath(i);
        images.push(img);
      }

      imagesRef.current = images;

      const render = () => {
        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        const img = images[videoFramesRef.current.frame];
        if (img && img.complete && img.naturalWidth > 0) {
          const imageAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = canvasWidth / canvasHeight;

          let drawWidth, drawHeight, drawX, drawY;

          if (imageAspect > canvasAspect) {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imageAspect;
            drawX = (canvasWidth - drawWidth) / 2;
            drawY = 0;
          } else {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imageAspect;
            drawX = 0;
            drawY = (canvasHeight - drawHeight) / 2;
          }

          context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }
      };

      const setupScrollTrigger = () => {
        ScrollTrigger.create({
          trigger: ".hero",
          start: "top top",
          end: `+=${window.innerHeight * 7}px`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            const animationProgress = Math.min(progress / 0.9, 1);
            const targetFrame = Math.round(
              animationProgress * (frameCount - 1)
            );
            videoFramesRef.current.frame = targetFrame;
            render();

            if (progress <= 0.1) {
              const navProgress = progress / 0.1;
              const opacity = 1 - navProgress;
              gsap.set(navRef.current, { opacity });
            } else {
              gsap.set(navRef.current, { opacity: 0 });
            }

            if (progress <= 0.25) {
              const zProgress = progress / 0.25;
              const translateZ = zProgress * -500;

              let opacity = 1;
              if (progress >= 0.2) {
                const fadeProgress = Math.min(
                  (progress - 0.2) / (0.25 - 0.2),
                  1
                );
                opacity = 1 - fadeProgress;
              }

              gsap.set(headerRef.current, {
                transform: `translate(-50%, -50%) translateZ(${translateZ}px)`,
                opacity,
              });
            } else {
              gsap.set(headerRef.current, { opacity: 0 });
            }

            if (progress < 0.6) {
              gsap.set(heroImgRef.current, {
                transform: "translateZ(1000px)",
                opacity: 0,
              });
            } else if (progress >= 0.6 && progress <= 0.9) {
              const imgProgress = (progress - 0.6) / (0.9 - 0.6);
              const translateZ = 1000 - imgProgress * 1000;

              let opacity = 0;
              if (progress <= 0.8) {
                const opacityProgress = (progress - 0.6) / (0.8 - 0.6);
                opacity = opacityProgress;
              } else {
                opacity = 1;
              }

              gsap.set(heroImgRef.current, {
                transform: `translateZ(${translateZ}px)`,
                opacity,
              });
            } else {
              gsap.set(heroImgRef.current, {
                transform: "translateZ(0px)",
                opacity: 1,
              });
            }
          },
        });
      };

      const handleResize = () => {
        setCanvasSize();
        render();
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <nav ref={navRef}>
        <div className="nav-links">
          <a href="#">Overview</a>
          <a href="#">Solutions</a>
          <a href="#">Resources</a>
        </div>
        <div className="logo">
          <a href="#">
            <img src={withBasePath("/logo.png")} alt="" /> Byewind
          </a>
        </div>
        <div className="nav-buttons">
          <div className="btn primary">
            <a href="#">Live Demo</a>
          </div>
          <div className="btn secondary">
            <a href="#">Get Started</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <canvas ref={canvasRef}></canvas>

        <div className="hero-content">
          <div className="header" ref={headerRef}>
            <h1>One unified workspace to build, test, and ship AI faster</h1>
            <p>Trusted by</p>
            <div className="client-logos">
              <div className="client-logo">
                <img src={withBasePath("/client-logo-1.png")} alt="" />
              </div>
              <div className="client-logo">
                <img src={withBasePath("/client-logo-2.png")} alt="" />
              </div>
              <div className="client-logo">
                <img src={withBasePath("/client-logo-3.png")} alt="" />
              </div>
              <div className="client-logo">
                <img src={withBasePath("/client-logo-4.png")} alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-img-container">
          <div className="hero-img" ref={heroImgRef}>
            <img src={withBasePath("/dashboard.png")} alt="" />
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>Join teams building faster with Byewind.</h1>
      </section>
    </div>
  );
}
