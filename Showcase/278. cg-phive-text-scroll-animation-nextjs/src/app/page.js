"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ReactLenis } from "lenis/react";

export default function Page() {
  const containerRef = useRef();
  const headerRef = useRef();
  const textElement1Ref = useRef();
  const textElement2Ref = useRef();
  const textElement3Ref = useRef();
  const textContainer3Ref = useRef();

  const [targetScales, setTargetScales] = useState([]);
  const headerSplitRef = useRef();

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const header = headerRef.current;
      const textElement1 = textElement1Ref.current;
      const textElement2 = textElement2Ref.current;
      const textElement3 = textElement3Ref.current;
      const textContainer3 = textContainer3Ref.current;

      const outroTextBgColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--dark")
        .trim();

      let headerSplit = null;
      if (header) {
        headerSplit = SplitText.create(header, {
          type: "words",
          wordsClass: "spotlight-word",
        });
        headerSplitRef.current = headerSplit;
        gsap.set(headerSplit.words, { opacity: 0 });
      }

      const currentTargetScales = [];

      function calculateDynamicScale() {
        for (let i = 1; i <= 3; i++) {
          const section = containerRef.current?.querySelector(
            `.sticky-text-${i}`
          );
          const text = containerRef.current?.querySelector(
            `.sticky-text-${i} .text-container h1`
          );

          if (!section || !text) continue;

          const sectionHeight = section.offsetHeight;
          const textHeight = text.offsetHeight;
          currentTargetScales[i - 1] = sectionHeight / textHeight;
        }
        setTargetScales([...currentTargetScales]);
      }

      calculateDynamicScale();
      window.addEventListener("resize", calculateDynamicScale);

      function setScaleY(element, scale) {
        if (element) {
          element.style.transform = `scaleY(${scale})`;
        }
      }

      ScrollTrigger.create({
        trigger: ".sticky-text-1",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const currentScale = currentTargetScales[0] * self.progress;
          setScaleY(textElement1, currentScale);
        },
      });

      ScrollTrigger.create({
        trigger: ".sticky-text-1",
        start: "top top",
        end: `+=${window.innerHeight * 1}px`,
        pin: true,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const currentScale = currentTargetScales[0] * (1 - self.progress);
          setScaleY(textElement1, currentScale);
        },
      });

      ScrollTrigger.create({
        trigger: ".sticky-text-2",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const currentScale = currentTargetScales[1] * self.progress;
          setScaleY(textElement2, currentScale);
        },
      });

      ScrollTrigger.create({
        trigger: ".sticky-text-2",
        start: "top top",
        end: `+=${window.innerHeight * 1}px`,
        pin: true,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const currentScale = currentTargetScales[1] * (1 - self.progress);
          setScaleY(textElement2, currentScale);
        },
      });

      ScrollTrigger.create({
        trigger: ".sticky-text-3",
        start: "top bottom",
        end: "top top",
        scrub: 1,
        onUpdate: (self) => {
          const currentScale = currentTargetScales[2] * self.progress;
          setScaleY(textElement3, currentScale);
        },
      });

      ScrollTrigger.create({
        trigger: ".sticky-text-3",
        start: "top top",
        end: `+=${window.innerHeight * 4}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress === 0) {
            textContainer3.style.backgroundColor = outroTextBgColor;
            textContainer3.style.opacity = 1;
          }

          if (progress <= 0.75) {
            const scaleProgress = progress / 0.75;
            const currentScale = 1 + 9 * scaleProgress;
            textContainer3.style.transform = `scale3d(${currentScale}, ${currentScale}, 1)`;
          } else {
            textContainer3.style.transform = `scale3d(10, 10, 1)`;
          }

          if (progress < 0.25) {
            textContainer3.style.backgroundColor = outroTextBgColor;
            textContainer3.style.opacity = 1;
          } else if (progress >= 0.25 && progress <= 0.5) {
            const fadeProgress = (progress - 0.25) / 0.25;
            const bgOpacity = Math.max(0, Math.min(1, 1 - fadeProgress));
            textContainer3.style.backgroundColor = outroTextBgColor.replace(
              "1)",
              `${bgOpacity})`
            );
          } else if (progress > 0.5) {
            textContainer3.style.backgroundColor = outroTextBgColor.replace(
              "1)",
              "0)"
            );
          }

          if (progress >= 0.5 && progress <= 0.75) {
            const textProgress = (progress - 0.5) / 0.25;
            const textOpacity = 1 - textProgress;
            textContainer3.style.opacity = textOpacity;
          } else if (progress > 0.75) {
            textContainer3.style.opacity = 0;
          }

          if (headerSplit && headerSplit.words.length > 0) {
            if (progress >= 0.75 && progress <= 0.95) {
              const textProgress = (progress - 0.75) / 0.2;
              const totalWords = headerSplit.words.length;

              headerSplit.words.forEach((word, index) => {
                const wordRevealProgress = index / totalWords;
                const opacity = textProgress >= wordRevealProgress ? 1 : 0;
                gsap.set(word, { opacity });
              });
            } else if (progress < 0.75) {
              gsap.set(headerSplit.words, { opacity: 0 });
            } else if (progress > 0.95) {
              gsap.set(headerSplit.words, { opacity: 1 });
            }
          }
        },
      });

      return () => {
        window.removeEventListener("resize", calculateDynamicScale);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <>
      <ReactLenis root>
        <div ref={containerRef}>
          <section className="hero">
            <h1>This space intentionally loud</h1>
          </section>

          <section className="sticky-text-1">
            <div className="text-container">
              <h1 ref={textElement1Ref}>Overdrive</h1>
            </div>
          </section>

          <section className="sticky-text-2">
            <div className="text-container">
              <h1 ref={textElement2Ref}>Static</h1>
            </div>
          </section>

          <section className="sticky-text-3">
            <div className="bg-img">
              <img src="/img.jpg" alt="" />
            </div>
            <div className="text-container" ref={textContainer3Ref}>
              <h1 ref={textElement3Ref}>Friction</h1>
            </div>
            <div className="header">
              <h1 ref={headerRef}>Overdrive always breaks the system</h1>
            </div>
          </section>

          <section className="outro">
            <h1>End of transmission</h1>
          </section>
        </div>
      </ReactLenis>
    </>
  );
}
