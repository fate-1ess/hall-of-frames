"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const initTextSplit = () => {
      const textElements = document.querySelectorAll(".col-3 h1, .col-3 p");

      textElements.forEach((element) => {
        const split = new SplitText(element, {
          type: "lines",
          linesClass: "line",
        });
        split.lines.forEach(
          (line) => (line.innerHTML = `<span>${line.textContent}</span>`)
        );
      });
    };

    initTextSplit();

    gsap.set(".col-3 .col-content-wrapper .line span", { y: "0%" });
    gsap.set(".col-3 .col-content-wrapper-2 .line span", { y: "-125%" });

    ScrollTrigger.create({
      trigger: ".sticky-cols",
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
    });

    let currentPhase = 0;

    ScrollTrigger.create({
      trigger: ".sticky-cols",
      start: "top top",
      end: `+=${window.innerHeight * 6}px`,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress >= 0.3 && currentPhase === 0) {
          currentPhase = 1;

          gsap.to(".col-1", { opacity: 0, scale: 0.75, duration: 0.75 });
          gsap.to(".col-2", { x: "0%", duration: 0.75 });
          gsap.to(".col-3", { y: "0%", duration: 0.75 });

          gsap.to(".col-img-1 img", { scale: 1.25, duration: 0.75 });
          gsap.to(".col-img-2", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.75,
          });
          gsap.to(".col-img-2 img", { scale: 1, duration: 0.75 });
        }

        if (progress >= 0.6 && currentPhase === 1) {
          currentPhase = 2;

          gsap.to(".col-2", { opacity: 0, scale: 0.75, duration: 0.75 });
          gsap.to(".col-3", { x: "0%", duration: 0.75 });
          gsap.to(".col-4", { y: "0%", duration: 0.75 });

          gsap.to(".col-3 .col-content-wrapper .line span", {
            y: "-125%",
            duration: 0.75,
          });
          gsap.to(".col-3 .col-content-wrapper-2 .line span", {
            y: "0%",
            duration: 0.75,
            delay: 0.5,
          });
        }

        if (progress < 0.3 && currentPhase >= 1) {
          currentPhase = 0;

          gsap.to(".col-1", { opacity: 1, scale: 1, duration: 0.75 });
          gsap.to(".col-2", { x: "100%", duration: 0.75 });
          gsap.to(".col-3", { y: "100%", duration: 0.75 });

          gsap.to(".col-img-1 img", { scale: 1, duration: 0.75 });
          gsap.to(".col-img-2", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 0.75,
          });
          gsap.to(".col-img-2 img", { scale: 1.25, duration: 0.75 });
        }

        if (progress < 0.6 && currentPhase === 2) {
          currentPhase = 1;

          gsap.to(".col-2", { opacity: 1, scale: 1, duration: 0.75 });
          gsap.to(".col-3", { x: "100%", duration: 0.75 });
          gsap.to(".col-4", { y: "100%", duration: 0.75 });

          gsap.to(".col-3 .col-content-wrapper .line span", {
            y: "0%",
            duration: 0.75,
            delay: 0.5,
          });
          gsap.to(".col-3 .col-content-wrapper-2 .line span", {
            y: "-125%",
            duration: 0.75,
          });
        }
      },
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <section className="intro">
        <h1>We create modern interiors that feel effortlessly personal.</h1>
      </section>

      <section className="sticky-cols">
        <div className="sticky-cols-wrapper">
          <div className="col col-1">
            <div className="col-content">
              <div className="col-content-wrapper">
                <h1>
                  We design spaces where comfort meets quiet sophistication.
                </h1>
                <p>
                  Layered textures, rich tones, and thoughtful details come
                  together to create interiors that feel lived-in yet elevated.
                </p>
              </div>
            </div>
          </div>

          <div className="col col-2">
            <div className="col-img col-img-1">
              <div className="col-img-wrapper">
                <Image
                  src="/img_01.jpg"
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-img col-img-2">
              <div className="col-img-wrapper">
                <Image
                  src="/img_02.jpg"
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          <div className="col col-3">
            <div className="col-content-wrapper">
              <h1>Our interiors are crafted to feel as calm as they look.</h1>
              <p>
                Each space is designed with intentional balance between warmth
                and modernity, light and shadow, function and beauty.
              </p>
            </div>
            <div className="col-content-wrapper-2">
              <h1>
                Every detail is chosen to bring ease and elegance into your
                space.
              </h1>
              <p>
                From custom furnishings to ambient lighting, we shape
                environments that reflect your lifestyle with timeless clarity.
              </p>
            </div>
          </div>

          <div className="col col-4">
            <div className="col-img">
              <div className="col-img-wrapper">
                <Image
                  src="/img_03.jpg"
                  alt=""
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="outro">
        <h1>Timeless design begins with a conversation.</h1>
      </section>
    </>
  );
}
