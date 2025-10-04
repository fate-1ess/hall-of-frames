"use client";

import { useState, useEffect, useRef } from "react";

const ImageTrail = ({ images: customImages }) => {
  const assetPrefix =
    process.env.NEXT_PUBLIC_ASSET_PREFIX ??
    process.env.NEXT_PUBLIC_BASE_PATH ??
    "";

  const sanitizedPrefix = assetPrefix.endsWith("/")
    ? assetPrefix.slice(0, -1)
    : assetPrefix;

  const applyAssetPrefix = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return sanitizedPrefix ? `${sanitizedPrefix}${normalizedPath}` : normalizedPath;
  };

  const [ready, setReady] = useState(false);
  const trailRef = useRef([]);
  const animationRef = useRef(null);

  const config = {
    imageCount: 35,
    imageLifespan: 750,
    removalDelay: 50,
    mouseThreshold: 100,
    scrollThreshold: 50,
    idleCursorInterval: 300,
    inDuration: 750,
    outDuration: 1000,
    inEasing: "cubic-bezier(.07,.5,.5,1)",
    outEasing: "cubic-bezier(.87, 0, .13, 1)",
  };

  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const lastMouseYRef = useRef(0);
  const isMovingRef = useRef(false);
  const isCursorInContainerRef = useRef(false);
  const isScrollingRef = useRef(false);
  const scrollTickingRef = useRef(false);

  const lastRemovalTimeRef = useRef(0);
  const lastSteadyImageTimeRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const moveTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const initialize = () => {
      const container = document.querySelector(".trail-container");
      if (!container) {
        console.error("Container with class 'trail-container' not found");
        return;
      }

      containerRef.current = container;

      setReady(true);

      const images =
        customImages ||
        Array.from({ length: config.imageCount }, (_, i) =>
          applyAssetPrefix(`/assets/img${i + 1}.jpeg`)
        );

      const isInContainer = (x, y) => {
        if (!containerRef.current) return false;

        const rect = containerRef.current.getBoundingClientRect();
        return (
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
        );
      };

      const hasMovedEnough = () => {
        const distance = Math.sqrt(
          Math.pow(mouseXRef.current - lastMouseXRef.current, 2) +
            Math.pow(mouseYRef.current - lastMouseYRef.current, 2)
        );
        return distance > config.mouseThreshold;
      };

      const createImage = () => {
        if (!containerRef.current || !isCursorInContainerRef.current) return;

        const img = document.createElement("img");
        img.classList.add("trail-img");

        const randomIndex = Math.floor(Math.random() * images.length);
        const rotation = (Math.random() - 0.5) * 50;
        img.src = images[randomIndex];

        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = mouseXRef.current - rect.left;
        const relativeY = mouseYRef.current - rect.top;

        img.style.left = `${relativeX}px`;
        img.style.top = `${relativeY}px`;
        img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
        img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;

        containerRef.current.appendChild(img);

        setTimeout(() => {
          img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
        }, 10);

        trailRef.current.push({
          element: img,
          rotation: rotation,
          removeTime: Date.now() + config.imageLifespan,
        });
      };

      const createScrollTrailImage = () => {
        if (!isCursorInContainerRef.current) return;

        lastMouseXRef.current +=
          (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
        lastMouseYRef.current +=
          (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);

        createImage();

        lastMouseXRef.current = mouseXRef.current;
        lastMouseYRef.current = mouseYRef.current;
      };

      const createTrailImage = () => {
        if (!isCursorInContainerRef.current) return;

        const now = Date.now();

        if (isMovingRef.current && hasMovedEnough()) {
          lastMouseXRef.current = mouseXRef.current;
          lastMouseYRef.current = mouseYRef.current;
          createImage();
          return;
        }

        if (
          !isMovingRef.current &&
          now - lastSteadyImageTimeRef.current >= config.idleCursorInterval
        ) {
          lastSteadyImageTimeRef.current = now;
          createImage();
        }
      };

      const removeOldImages = () => {
        const now = Date.now();

        if (
          now - lastRemovalTimeRef.current < config.removalDelay ||
          trailRef.current.length === 0
        )
          return;

        const oldestImage = trailRef.current[0];
        if (now >= oldestImage.removeTime) {
          const imgToRemove = trailRef.current.shift();

          imgToRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
          imgToRemove.element.style.transform = `translate(-50%, -50%) rotate(${imgToRemove.rotation}deg) scale(0)`;

          lastRemovalTimeRef.current = now;

          setTimeout(() => {
            if (imgToRemove.element.parentNode) {
              imgToRemove.element.parentNode.removeChild(imgToRemove.element);
            }
          }, config.outDuration);
        }
      };

      const animate = () => {
        createTrailImage();
        removeOldImages();
        animationRef.current = requestAnimationFrame(animate);
      };

      const setInitialMousePos = (event) => {
        mouseXRef.current = event.clientX;
        mouseYRef.current = event.clientY;
        lastMouseXRef.current = mouseXRef.current;
        lastMouseYRef.current = mouseYRef.current;
        isCursorInContainerRef.current = isInContainer(
          mouseXRef.current,
          mouseYRef.current
        );
        document.removeEventListener("mousemove", setInitialMousePos, false);
      };

      document.addEventListener("mousemove", setInitialMousePos, {
        once: true,
      });

      const handleMouseMove = (e) => {
        mouseXRef.current = e.clientX;
        mouseYRef.current = e.clientY;
        isCursorInContainerRef.current = isInContainer(
          mouseXRef.current,
          mouseYRef.current
        );

        if (isCursorInContainerRef.current) {
          isMovingRef.current = true;
          clearTimeout(moveTimeoutRef.current);
          moveTimeoutRef.current = setTimeout(() => {
            isMovingRef.current = false;
          }, 100);
        }
      };

      const handleScroll1 = () => {
        isCursorInContainerRef.current = isInContainer(
          mouseXRef.current,
          mouseYRef.current
        );

        if (isCursorInContainerRef.current) {
          isMovingRef.current = true;
          lastMouseXRef.current += (Math.random() - 0.5) * 10;

          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
            isMovingRef.current = false;
          }, 100);
        }
      };

      const handleScroll2 = () => {
        const now = Date.now();
        isScrollingRef.current = true;

        if (now - lastScrollTimeRef.current < config.scrollThreshold) return;

        lastScrollTimeRef.current = now;

        if (!scrollTickingRef.current) {
          requestAnimationFrame(() => {
            if (isScrollingRef.current) {
              createScrollTrailImage();
              isScrollingRef.current = false;
            }
            scrollTickingRef.current = false;
          });
          scrollTickingRef.current = true;
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("scroll", handleScroll1, { passive: true });
      window.addEventListener("scroll", handleScroll2, { passive: true });

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll1);
        window.removeEventListener("scroll", handleScroll2);
        clearTimeout(moveTimeoutRef.current);
        clearTimeout(scrollTimeoutRef.current);
        cancelAnimationFrame(animationRef.current);

        trailRef.current.forEach((item) => {
          if (item.element && item.element.parentNode) {
            item.element.parentNode.removeChild(item.element);
          }
        });
        trailRef.current = [];
      };
    };

    const cleanup = initialize();
    return cleanup;
  }, []);

  return (
    <span
      ref={containerRef}
      style={{ display: "none" }}
      data-trail-initialized={ready ? "true" : "false"}
    />
  );
};

export default ImageTrail;
