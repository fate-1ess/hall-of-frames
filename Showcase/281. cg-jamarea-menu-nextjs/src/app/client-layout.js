"use client";

import { useRef } from "react";
import Menu from "@/Menu/Menu";

export default function ClientLayout({ children }) {
  const containerRef = useRef(null);

  return (
    <>
      <Menu containerRef={containerRef} />
      <div className="container" ref={containerRef}>
        {children}
      </div>
    </>
  );
}
