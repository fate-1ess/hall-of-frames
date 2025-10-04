"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "@/components/ReactLenis";
import { withAssetPrefix } from "@/utils/base-path";

export default function ProjectClient({ project, nextProject, prevProject }) {
  const projectNavRef = useRef(null);
  const progressBarRef = useRef(null);
  const projectDescriptionRef = useRef(null);
  const footerRef = useRef(null);
  const nextProjectProgressBarRef = useRef(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldUpdateProgress, setShouldUpdateProgress] = useState(true);

  const imagePaths = (project.images ?? []).map((image) =>
    withAssetPrefix(image)
  );

  const prevLinkRef = useRef(null);
  const nextLinkRef = useRef(null);

  const buildProjectHref = useCallback(
    (slug) => withAssetPrefix(`/projects/${slug}`),
    []
  );

  const handleNavigation = useCallback((slug) => {
    const fallback = buildProjectHref(slug);
    if (slug === prevProject.slug) {
      const href = prevLinkRef.current?.href ?? fallback;
      window.location.assign(href);
      return;
    }

    if (slug === nextProject.slug) {
      const href = nextLinkRef.current?.href ?? fallback;
      window.location.assign(href);
      return;
    }

    window.location.assign(fallback);
  }, [buildProjectHref, nextProject.slug, prevProject.slug]);

  const handlePrevClick = useCallback(
    (event) => {
      event.preventDefault();
      const href = event.currentTarget.href;
      if (href) {
        window.location.assign(href);
        return;
      }

      handleNavigation(prevProject.slug);
    },
    [handleNavigation, prevProject.slug]
  );

  const handleNextClick = useCallback(
    (event) => {
      event.preventDefault();
      const href = event.currentTarget.href;
      if (href) {
        window.location.assign(href);
        return;
      }

      handleNavigation(nextProject.slug);
    },
    [handleNavigation, nextProject.slug]
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(projectNavRef.current, {
      opacity: 0,
      y: -100,
    });

    gsap.to(projectNavRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.25,
      ease: "power3.out",
    });

    gsap.to(projectDescriptionRef.current, {
      opacity: 1,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    });

    const navScrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, {
            scaleX: self.progress,
          });
        }
      },
    });

    const footerScrollTrigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 3}px`,
      pin: true,
      pinSpacing: true,
      onEnter: () => {
        if (projectNavRef.current && !isTransitioning) {
          gsap.to(projectNavRef.current, {
            y: -100,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
      onLeaveBack: () => {
        if (projectNavRef.current && !isTransitioning) {
          gsap.to(projectNavRef.current, {
            y: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      },
      onUpdate: (self) => {
        if (nextProjectProgressBarRef.current && shouldUpdateProgress) {
          gsap.set(nextProjectProgressBarRef.current, {
            scaleX: self.progress,
          });
        }

        if (self.progress >= 1 && !isTransitioning) {
          setShouldUpdateProgress(false);
          setIsTransitioning(true);

          const tl = gsap.timeline();

          tl.set(nextProjectProgressBarRef.current, {
            scaleX: 1,
          });

          tl.to(
            [
              footerRef.current?.querySelector(".project-footer-copy"),
              footerRef.current?.querySelector(".next-project-progress"),
            ],
            {
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut",
            }
          );

          tl.call(() => {
            const href = nextLinkRef.current?.href;
            if (href) {
              window.location.assign(href);
            } else {
              handleNavigation(nextProject.slug);
            }
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [handleNavigation, nextProject.slug, isTransitioning, shouldUpdateProgress]);

  return (
    <ReactLenis root>
      <div className="project-page">
        <div className="project-nav" ref={projectNavRef}>
          <div className="link">
            <span>&#8592;&nbsp;</span>
            <a
              href={buildProjectHref(prevProject.slug)}
              ref={prevLinkRef}
              onClick={handlePrevClick}
            >
              Previous
            </a>
          </div>

          <div className="project-page-scroll-progress">
            <p>{project.title}</p>

            <div
              className="project-page-scroll-progress-bar"
              ref={progressBarRef}
            ></div>
          </div>

          <div className="link">
            <a
              href={buildProjectHref(nextProject.slug)}
              ref={nextLinkRef}
              onClick={handleNextClick}
            >
              Next
            </a>
            <span>&#8594;&nbsp;</span>
          </div>
        </div>

        <div className="project-hero">
          <h1>{project.title}</h1>

          <p id="project-description" ref={projectDescriptionRef}>
            {project.description}
          </p>
        </div>

        <div className="project-images">
          {imagePaths.map((image, index) => (
              <div className="project-img" key={index}>
                <img src={image} alt="" />
              </div>
            ))}
        </div>

        <div className="project-footer" ref={footerRef}>
          <h1>{nextProject.title}</h1>

          <div className="project-footer-copy">
            <p>Next Project</p>
          </div>

          <div className="next-project-progress">
            <div
              className="next-project-progress-bar"
              ref={nextProjectProgressBarRef}
            ></div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
