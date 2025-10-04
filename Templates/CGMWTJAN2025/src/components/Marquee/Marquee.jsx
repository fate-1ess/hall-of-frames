"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Marquee.css";

const ANIMATION_DURATION = 15;

const Marquee = () => {
  const wrapperRef = useRef(null);
  const animationRef = useRef(null);
  const directionRef = useRef(-1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const content = wrapper.children[0];

    for (let i = 0; i < 3; i++) {
      const clone = content.cloneNode(true);
      wrapper.appendChild(clone);
    }

    const singleWidth = content.offsetWidth;
    const totalWidth = singleWidth * 2;

    const createAnimation = () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }

      let currentX = gsap.getProperty(wrapper, "x");

      if (currentX <= -totalWidth) {
        currentX = currentX % singleWidth;
        gsap.set(wrapper, { x: currentX });
      } else if (currentX >= 0) {
        currentX = -singleWidth + (currentX % singleWidth);
        gsap.set(wrapper, { x: currentX });
      }

      const targetX =
        directionRef.current === -1
          ? currentX - singleWidth
          : currentX + singleWidth;

      const remainingDistance = Math.abs(targetX - currentX);
      const remainingDuration =
        (remainingDistance / singleWidth) * ANIMATION_DURATION;

      animationRef.current = gsap.to(wrapper, {
        x: targetX,
        duration: remainingDuration,
        ease: "none",
        repeat: -1,
        onRepeat: () => {
          let resetX = gsap.getProperty(wrapper, "x");

          if (directionRef.current === -1 && resetX <= -totalWidth) {
            resetX = resetX % singleWidth;
          } else if (directionRef.current === 1 && resetX >= 0) {
            resetX = -singleWidth + (resetX % singleWidth);
          }

          gsap.set(wrapper, { x: resetX });
        },
      });
    };

    createAnimation();

    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const newDirection = st > lastScrollTop ? -1 : 1;

      if (newDirection !== directionRef.current) {
        directionRef.current = newDirection;
        createAnimation();
      }

      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="marquee">
      <div className="marquee-wrapper" ref={wrapperRef}>
        <div className="marquee-content">
          <h1>
            The Evolution of AI — The Evolution of AI — The Evolution of AI —
            The Evolution of AI —
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Marquee;
