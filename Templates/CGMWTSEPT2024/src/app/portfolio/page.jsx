"use client";
import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import Link from "next/link";
import "./portfolio.css";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useWithBasePath } from "../lib/basePath";

const PROJECTS = [
  { name: "Urban Oasis", img: "project-1.jpg", size: "lg" },
  { name: "Smart Living", img: "project-2.jpg", size: "sm" },
  { name: "Eco Fashion", img: "project-3.jpg", size: "lg" },
  { name: "VR Fitness", img: "project-4.jpg", size: "sm" },
  { name: "Clean Energy", img: "project-5.jpg", size: "lg" },
  { name: "AR Learning", img: "project-6.jpg", size: "lg" },
  { name: "Green Pack", img: "project-7.jpg", size: "lg" },
  { name: "Drone Post", img: "project-8.jpg", size: "lg" },
  { name: "Secure Vote", img: "project-9.jpg", size: "sm" },
];

const Page = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const withBasePath = useWithBasePath();

  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    const loadImages = async () => {
      const imagePromises = PROJECTS.map((project) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = withBasePath(`/portfolio/${project.img}`);
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        if (isMounted) {
          setIsLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [withBasePath]);

  useGSAP(
    () => {
      if (isLoaded && containerRef.current) {
        const header = containerRef.current.querySelector(
          ".portfolio-header h1"
        );
        const cols = containerRef.current.querySelectorAll(".col");

        gsap.to(header, {
          y: 0,
          delay: 0.75,
          duration: 1.5,
          ease: "power4.out",
        });

        gsap.to(cols, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.5,
          delay: 0.9,
          ease: "power4.out",
          stagger: 0.1,
        });

        cols.forEach((col) => {
          const img = col.querySelector("img");
          const titleP = col.querySelector(".project-title h3");

          col.addEventListener("mouseenter", () => {
            gsap.to(img, {
              scale: 1.25,
              duration: 2,
              ease: "power4.out",
            });
            gsap.to(titleP, {
              y: 0,
              duration: 1,
              ease: "power4.out",
            });
          });

          col.addEventListener("mouseleave", () => {
            gsap.to(img, {
              scale: 1,
              duration: 2,
              ease: "power4.out",
            });
            gsap.to(titleP, {
              y: 24,
              duration: 1,
              ease: "power4.out",
            });
          });
        });
      }
    },
    { scope: containerRef, dependencies: [isLoaded] }
  );

  const renderProjectRows = () => {
    const rows = [];
    for (let i = 0; i < PROJECTS.length; i += 3) {
      rows.push(
        <div className="portfolio-row" key={i}>
          {PROJECTS.slice(i, i + 3).map((project, index) => (
            <div className={`col ${project.size}`} key={i + index}>
              <Link href="/portfolio/project">
                <div className="project-image">
                  <NextImage
                    src={withBasePath(`/portfolio/${project.img}`)}
                    alt={project.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                    priority={i === 0 && index === 0}
                  />
                </div>
                <div className="project-title">
                  <h3>{project.name}</h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <ReactLenis root>
      <div
        className={`portfolio-page ${isLoaded ? "loaded" : ""}`}
        ref={containerRef}
      >
        <div className="container">
          <div className="portfolio-header">
            <h1>Portfolio</h1>
          </div>
          {isLoaded && renderProjectRows()}
        </div>
      </div>
    </ReactLenis>
  );
};

export default Page;
