"use client";

import { useEffect, useRef } from "react";

export default function TextDisplacementAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const animateTextElements = (selector, splitBy) => {
      const textContainers = containerRef.current.querySelectorAll(selector);

      textContainers.forEach((textContainer) => {
        let elements = [];
        let elementType = "";

        if (splitBy === "words") {
          elements = textContainer.textContent.trim().split(/\s+/);
          elementType = "word";
        } else if (splitBy === "letters") {
          const words = textContainer.textContent.trim().split(/\s+/);
          elements = [];

          words.forEach((word, wordIndex) => {
            for (let i = 0; i < word.length; i++) {
              elements.push(word[i]);
            }

            if (wordIndex < words.length - 1) {
              elements.push(" ");
            }
          });

          elementType = "letter";
        }

        textContainer.textContent = "";

        const animatedElements = [];

        elements.forEach((element, index) => {
          if (splitBy === "letters" && element === " ") {
            textContainer.appendChild(document.createTextNode(" "));
            return;
          }

          const elementSpan = document.createElement("span");
          elementSpan.classList.add(elementType);
          elementSpan.textContent = element;
          textContainer.appendChild(elementSpan);

          if (splitBy === "words" && index < elements.length - 1) {
            textContainer.appendChild(document.createTextNode(" "));
          }

          animatedElements.push({
            element: elementSpan,
            originalX: 0,
            originalY: 0,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
          });
        });

        setTimeout(() => {
          animatedElements.forEach((element) => {
            const rect = element.element.getBoundingClientRect();
            element.originalX = rect.left + rect.width / 2;
            element.originalY = rect.top + rect.height / 2;
            element.currentX = 0;
            element.currentY = 0;
            element.targetX = 0;
            element.targetY = 0;
          });
        }, 100);

        const handleMouseMove = (e) => {
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          const radius = 150;
          const maxDisplacement = 300;

          animatedElements.forEach((element) => {
            const originalX = element.originalX;
            const originalY = element.originalY;

            const dx = originalX - mouseX;
            const dy = originalY - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
              const force = (1 - distance / radius) * maxDisplacement;

              element.targetX = (dx / distance) * force;
              element.targetY = (dy / distance) * force;
            } else {
              element.targetX = 0;
              element.targetY = 0;
            }
          });
        };

        document.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
          const lerpFactor = 0.1;

          animatedElements.forEach((element) => {
            element.currentX +=
              (element.targetX - element.currentX) * lerpFactor;
            element.currentY +=
              (element.targetY - element.currentY) * lerpFactor;

            element.element.style.transform = `translate(${element.currentX}px, ${element.currentY}px)`;
          });

          requestAnimationFrame(animate);
        };

        animate();

        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
        };
      });
    };

    animateTextElements(".anime-text", "words");
    animateTextElements(".anime-header", "letters");

    const handleResize = () => {
      animateTextElements(".anime-text", "words");
      animateTextElements(".anime-header", "letters");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <h1 className="anime-header">one subscription</h1>

      <p className="anime-text">
        Sharing all the sauce behind building dope interactive experiences and
        the finest websites that truly stand out. Recently, CodegridPRO was
        introduced, a subscription-based service tailored to the needs of
        passionate web designers. As a PRO member, you gain exclusive access to
        source code for each tutorial and monthly website templates. These
        resources are carefully curated to support and inspire your creativity,
        helping you take your web design skills to the next level. CodegridPRO
        opens up a realm of opportunities for professional growth and empowers
        you to bring your ideas to life with ease. Delve into coding without
        clutter. Access the source code for every tutorial published on the
        Codegrid YouTube channel and build elegant website components
        effortlessly. Take the fast lane to mastery. Each month, you'll receive
        a fresh complete responsive website template. Inspired by award winning
        web experiences, these templates allow you to build standout websites
        without starting from scratch, serving as the perfect foundation for
        your next project.
      </p>

      <h1 className="anime-header">endless web design</h1>
    </div>
  );
}
