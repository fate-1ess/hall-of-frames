"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

const ReactLenis = ({ children, options = {}, root = false }) => {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!root) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      ...options,
    });

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options, root]);

  return children;
};

export default ReactLenis;
