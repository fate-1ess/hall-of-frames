"use client";

import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import "./project.css";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useWithBasePath } from "../../lib/basePath";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const firstImgRef = useRef(null);
  const imgRefs = useRef([]);
  const copyH3Refs = useRef([]);
  const nextProjectRef = useRef(null);
  const nextProjectTitleRef = useRef(null);
  const splitTypeRef = useRef(null);
  const [isSplitReady, setIsSplitReady] = useState(false);
  const withBasePath = useWithBasePath();

  useEffect(() => {
    let isMounted = true;

    const loadSplitType = async () => {
      const splitTypeModule = await import("../../lib/SplitType/index");
      if (isMounted) {
        splitTypeRef.current = splitTypeModule.default;
        setIsSplitReady(true);
      }
    };

    loadSplitType();

    return () => {
      isMounted = false;
    };
  }, []);

  useGSAP(
    () => {
      if (!isSplitReady || !splitTypeRef.current) {
        return;
      }

      const SplitType = splitTypeRef.current;
      const tl = gsap.timeline();

      tl.fromTo(
        titleRef.current,
        { y: 100 },
        { y: 0, duration: 1.5, ease: "power4.out" }
      );

      tl.fromTo(
        dateRef.current,
        { y: 100 },
        { y: 0, duration: 1.5, ease: "power4.out" },
        "-=1.4"
      );

      tl.fromTo(
        firstImgRef.current,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.5,
          ease: "power4.out",
        },
        "-=1"
      );

      imgRefs.current.forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger: img,
              start: "top 50%",
            },
          }
        );
      });

      copyH3Refs.current.forEach((h3) => {
        const split = new SplitType(h3, { types: "lines" });

        split.lines.forEach((line) => {
          const wrapper = document.createElement("div");
          wrapper.className = "line";
          line.parentNode.insertBefore(wrapper, line);
          wrapper.appendChild(line);
        });

        gsap.from(h3.querySelectorAll(".line"), {
          y: 36,
          duration: 1,
          stagger: 0.02,
          ease: "power4.out",
          scrollTrigger: {
            trigger: h3,
            start: "top 80%",
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef, dependencies: [isSplitReady] }
  );

  return (
    <ReactLenis root>
      <div className="project-page" ref={containerRef}>
        <div className="container">
          <div className="project-page-title">
            <h1 ref={titleRef}>Urban Oasis</h1>
          </div>
          <div className="project-date">
            <p ref={dateRef}>2011 - 2017</p>
          </div>

          <div className="project-content">
            <div className="img img-1" ref={firstImgRef}>
              <NextImage
                src={withBasePath("/portfolio/project-1.jpg")}
                alt="Interior design concept showcasing Urban Oasis project"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>

            <div className="copy">
              <h3 ref={(el) => (copyH3Refs.current[0] = el)}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
                Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut
                in nulla enim. Phasellus molestie magna non est bibendum non
                venenatis nisl tempor. Suspendisse dictum feugiat nisl ut
                dapibus. Mauris iaculis porttitor posuere. Praesent id metus
                massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et
                justo dignissim congue. Donec congue lacinia dui, a porttitor
                lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget
                odio ac lectus vestibulum faucibus eget in metus. In pellentesque
                faucibus vestibulum. Nulla at nulla justo, eget luctus tortor.
              </h3>
            </div>

            <div className="img img-2" ref={(el) => (imgRefs.current[0] = el)}>
              <NextImage
                src={withBasePath("/portfolio/project-2.jpg")}
                alt="Detail view of Smart Living interior"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="img img-3" ref={(el) => (imgRefs.current[1] = el)}>
              <NextImage
                src={withBasePath("/portfolio/project-3.jpg")}
                alt="Ambient lighting concept for Eco Fashion retail"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="copy">
              <h3 ref={(el) => (copyH3Refs.current[1] = el)}>
                Mauris iaculis porttitor posuere. Praesent id metus massa, ut
                blandit odio. Proin quis tortor orci. Etiam at risus et justo
                dignissim congue. Donec congue lacinia dui, a porttitor lectus
                condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio
                ac lectus vestibulum faucibus eget in metus. In pellentesque
                faucibus vestibulum. Nulla at nulla justo, eget luctus tortor.
                Nulla facilisi. Duis aliquet egestas purus in blandit. Curabitur
                vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare
                ante, ac egestas est urna sit amet arcu. Class aptent taciti
                sociosqu ad litora torquent per conubia nostra, per inceptos
                himenaeos.
              </h3>
            </div>

            <div className="img img-4" ref={(el) => (imgRefs.current[2] = el)}>
              <NextImage
                src={withBasePath("/portfolio/project-4.jpg")}
                alt="Architectural visualization with warm lighting"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="img img-5" ref={(el) => (imgRefs.current[3] = el)}>
              <NextImage
                src={withBasePath("/portfolio/project-5.jpg")}
                alt="Minimalist interior styling for hospitality space"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="copy">
              <h3 ref={(el) => (copyH3Refs.current[2] = el)}>
                Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut
                in nulla enim. Phasellus molestie magna non est bibendum non
                venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
                Mauris iaculis porttitor posuere. Praesent id metus massa, ut
                blandit odio. Proin quis tortor orci. Etiam at risus et justo
                dignissim congue. Donec congue lacinia dui, a porttitor lectus
                condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio
                ac lectus vestibulum faucibus eget in metus. In pellentesque
                faucibus vestibulum. Nulla at nulla justo, eget luctus tortor.
              </h3>
            </div>

            <div className="img img-6" ref={(el) => (imgRefs.current[4] = el)}>
              <NextImage
                src={withBasePath("/portfolio/project-6.jpg")}
                alt="Cozy lounge area with modern furnishings"
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="next-project" ref={nextProjectRef}>
              <p>Next Project</p>
            </div>
            <div className="next-project-title" ref={nextProjectTitleRef}>
              <Link href="/">
                <h2>Secure Vote</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
};

export default Page;
