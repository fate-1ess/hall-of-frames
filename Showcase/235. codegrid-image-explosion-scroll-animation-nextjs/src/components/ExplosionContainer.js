"use client";

import { useEffect, useRef, useState } from "react";

const ExplosionContainer = ({ images: customImages }) => {
  const explosionContainerRef = useRef(null);
  const footerRef = useRef(null);
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const particlesRef = useRef([]);

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 150,
    horizontalForce: 20,
    verticalForce: 15,
    rotationSpeed: 10,
    resetDelay: 500,
  };

  const assetPrefix =
    process.env.NEXT_PUBLIC_ASSET_PREFIX ??
    process.env.NEXT_PUBLIC_BASE_PATH ??
    "";

  const sanitizedPrefix = assetPrefix.endsWith("/")
    ? assetPrefix.slice(0, -1)
    : assetPrefix;

  const applyAssetPrefix = (path) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return sanitizedPrefix ? `${sanitizedPrefix}${normalized}` : normalized;
  };

  const imageParticleCount = 15;
  const imagePaths = customImages
    ? customImages
    : Array.from({ length: imageParticleCount }, (_, i) =>
        applyAssetPrefix(`/assets/img${i + 1}.jpg`)
      );

  class Particle {
    constructor(element) {
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.element) {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
      }
    }
  }

  const createParticles = () => {
    if (!explosionContainerRef.current) return;

    explosionContainerRef.current.innerHTML = "";
    particlesRef.current = [];

    imagePaths.forEach((path) => {
      const particle = document.createElement("img");
      particle.src = path;
      particle.classList.add("explosion-particle-img");
      particle.style.width = `${config.imageSize}px`;
      explosionContainerRef.current.appendChild(particle);
    });

    const particleElements = explosionContainerRef.current.querySelectorAll(
      ".explosion-particle-img"
    );
    particlesRef.current = Array.from(particleElements).map(
      (element) => new Particle(element)
    );
  };

  const explode = () => {
    if (explosionTriggered) return;
    setExplosionTriggered(true);

    createParticles();

    let animationId;
    let finished = false;

    const animate = () => {
      if (finished) return;

      particlesRef.current.forEach((particle) => particle.update());

      if (
        explosionContainerRef.current &&
        particlesRef.current.every(
          (particle) =>
            particle.y > explosionContainerRef.current.offsetHeight / 2
        )
      ) {
        cancelAnimationFrame(animationId);
        finished = true;
        setTimeout(() => {
          setExplosionTriggered(false);
        }, config.resetDelay);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  const checkFooterPosition = () => {
    if (!footerRef.current) return;

    const footerRect = footerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (
      !explosionTriggered &&
      footerRect.top <= viewportHeight - footerRect.height * 0.5
    ) {
      explode();
    }
  };

  useEffect(() => {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });

    footerRef.current = document.querySelector("footer");

    createParticles();

    let checkTimeout;
    const handleScroll = () => {
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(checkFooterPosition, 10);
    };

    window.addEventListener("scroll", handleScroll);

    setTimeout(checkFooterPosition, 500);

    const handleResize = () => {
      setExplosionTriggered(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(checkTimeout);
    };
  }, []);

  return (
    <div ref={explosionContainerRef} className="explosion-container"></div>
  );
};

export default ExplosionContainer;
