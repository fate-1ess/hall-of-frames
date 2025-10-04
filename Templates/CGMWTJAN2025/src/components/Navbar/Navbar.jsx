"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { resolveAnchorHref, resolvePagePath } from "@/utils/base-path";

import "./Navbar.css";

const MusicToggle = dynamic(() => import("../MusicToggle/MusicToggle"), {
  ssr: false,
});

const Navbar = () => {
  const [time, setTime] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (event, sectionId) => {
    event.preventDefault();

    if (isHomePage) {
      const lenis = window.lenis;
      if (lenis) {
        const element = document.getElementById(sectionId);
        if (element) {
          lenis.scrollTo(element, {
            offset: 0,
            immediate: false,
            duration: 1.5,
          });
        }
      }
    } else {
      const target = `${resolvePagePath("/")}#${sectionId}`;
      window.location.href = target;
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-col">
        <div className="navbar-sub-col logo">
          <Link href={resolveAnchorHref("/")} prefetch={false}>
            <h3>Algora</h3>
          </Link>
        </div>
        <div className="navbar-sub-col time">
          <p>{time}</p>
        </div>
      </div>
      <div className="navbar-col">
        <div className="navbar-sub-col nav-items">
          <a href="#intro" onClick={(e) => handleNavigation(e, "intro")}>
            <p>The Origins</p>
          </a>
          <a
            href="#case-studies"
            onClick={(e) => handleNavigation(e, "case-studies")}
          >
            <p>Highlights</p>
          </a>
          <a href="#works" onClick={(e) => handleNavigation(e, "works")}>
            <p>Innovations</p>
          </a>
        </div>
        <div className="navbar-sub-col music-toggle-wrapper">
          <MusicToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
