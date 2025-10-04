import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { IoMdArrowBack } from "react-icons/io";
import gsap from "gsap";

const BackButton = () => {
  const buttonRef = useRef(null);
  const fillRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const fill = fillRef.current;
    const icon = iconRef.current;

    const hoverAnimation = gsap
      .timeline({ paused: true })
      .to(fill, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.3,
        ease: "power2.out",
      })
      .to(
        icon,
        {
          color: "#000000",
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );

    const handleMouseEnter = () => {
      hoverAnimation.play();
    };

    const handleMouseLeave = () => {
      hoverAnimation.reverse();
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      hoverAnimation.kill();
    };
  }, []);

  return (
    <div className="back-btn" ref={buttonRef}>
      <Link to="/">
        <div
          className="back-btn-fill"
          ref={fillRef}
          style={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
        />
        <div className="back-btn-icon" ref={iconRef}>
          <IoMdArrowBack size={26} />
        </div>
      </Link>
    </div>
  );
};

export default BackButton;
