"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";
import { MdArrowOutward } from "react-icons/md";
import Marquee from "@/components/Marquee/Marquee";
import Footer from "@/components/Footer/Footer";
import ShuffleText from "@/components/ShuffleText/ShuffleText";
import GeometricBackground from "@/components/GeometricBackground/GeometricBackground";
import { carouselItems } from "./carouselItems";
import { resolveAnchorHref, resolveAssetPath } from "@/utils/base-path";

import "./home.css";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef();

  // initialize Lenis smooth scrolling instance on window
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      window.lenis = lenis;
    }

    return () => {
      window.lenis = null;
    };
  }, [lenis]);

  // controls geometric background animation on scroll
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ".intro",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const yMove = -750 * progress;
          const rotation = 360 * progress;

          gsap.to(".geo-bg", {
            y: yMove,
            rotation: rotation,
            duration: 0.1,
            ease: "none",
            overwrite: true,
          });
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles case studies image pinning and scale animations on scroll
  useGSAP(
    () => {
      const images = gsap.utils.toArray(".case-studies-img");

      images.forEach((img, i) => {
        const imgElement = img.querySelector("img");

        ScrollTrigger.create({
          trigger: img,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            gsap.to(imgElement, {
              scale: 2 - self.progress,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        ScrollTrigger.create({
          trigger: img,
          start: "top top",
          end: () =>
            `+=${
              document.querySelector(".case-studies-item").offsetHeight *
              (images.length - i - 1)
            }`,
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  // handles carousel slide transitions with clip-path animations
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const projects = gsap.utils.toArray(".project");

      ScrollTrigger.create({
        trigger: ".carousel",
        start: "top top",
        end: `+=${window.innerHeight * (projects.length - 1)}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress * (projects.length - 1);
          const currentSlide = Math.floor(progress);
          const slideProgress = progress - currentSlide;

          if (currentSlide < projects.length - 1) {
            gsap.set(projects[currentSlide], {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            });

            const nextSlideProgress = gsap.utils.interpolate(
              "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              slideProgress
            );

            gsap.set(projects[currentSlide + 1], {
              clipPath: nextSlideProgress,
            });
          }

          projects.forEach((project, index) => {
            if (index < currentSlide) {
              gsap.set(project, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              });
            } else if (index > currentSlide + 1) {
              gsap.set(project, {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              });
            }
          });
        },
      });

      gsap.set(projects[0], {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
      }}
    >
      <div className="app" ref={container}>
        <section className="hero">
          <div className="hero-img">
            <img src={resolveAssetPath("images/home/hero.jpeg")} alt="" />
          </div>
          <div className="hero-img-overlay"></div>
          <div className="hero-img-gradient"></div>
          <div className="container">
            <div className="hero-copy">
              <div className="hero-copy-col">
                <ShuffleText as="h3" text="A brief journey into" />
                <ShuffleText as="h1" text="The Fusion of Art and Algorithms" />
              </div>
              <div className="hero-copy-col">
                <div className="hero-icon">
                  <img
                    src={resolveAssetPath("images/home/hero-abstract-icon.png")}
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="intro" id="intro">
          <div className="geo-bg">
            <GeometricBackground />
          </div>
          <Marquee />
          <div className="intro-container">
            <div className="container">
              <div className="col">
                <p className="primary">[ Setting the Scene ]</p>
              </div>
              <div className="col">
                <div className="intro-copy">
                  <p>
                    Algora has revolutionized the creative potential of AI,
                    advancing from basic, low-resolution outputs to producing
                    hyper-realistic, high-definition visuals that push the
                    boundaries of imagination and innovation.
                  </p>
                  <p>
                    This progress has opened the doors to powerful visual
                    creation tools for users of all skill levels, from seasoned
                    professionals to casual creators. Yet, it has also raised
                    critical debates around the ethical challenges of
                    AI-generated content, such as intellectual property
                    disputes, the spread of false information, and questions
                    surrounding the essence of true artistic expression.
                  </p>
                </div>
                <div className="prompt-example">
                  <div className="prompt-example-header">
                    <h4>
                      // PROMPT: A sci-fi fashion portrait of a person in
                      futuristic attire
                    </h4>
                  </div>
                  <div className="prompt-example-results">
                    <div className="prompt-example-result-item">
                      <div className="prompt-example-result-item-img">
                        <img
                          src={resolveAssetPath("images/home/prompt-1.jpeg")}
                          alt=""
                        />
                        <div className="hero-img-overlay"></div>
                      </div>
                      <div className="prompt-example-result-item-title">
                        <h4>2016 — Built with pioneering generative tools</h4>
                      </div>
                    </div>
                    <div className="prompt-example-result-item">
                      <div className="prompt-example-result-item-img">
                        <img
                          src={resolveAssetPath("images/home/prompt-2.jpeg")}
                          alt=""
                        />
                        <div className="hero-img-overlay"></div>
                      </div>
                      <div className="prompt-example-result-item-title">
                        <h4>2024 — Created with Algora V2</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies" id="case-studies">
          <div className="case-studies-header">
            <div className="container">
              <ShuffleText
                as="h2"
                text="Dive Into New Success Stories"
                triggerOnScroll={true}
              />
            </div>
          </div>
          <div className="case-studies-content">
            <div className="container">
              <div className="col">
                <p className="primary">[ Case Studies ]</p>
              </div>
              <div className="col">
                <div className="case-studies-copy">
                  <h2>How is AI Reshaping Artistic Boundaries?</h2>
                  <p>
                    Generative AI has rapidly advanced, moving beyond its humble
                    beginnings of basic visual outputs to now creating stunning,
                    lifelike artworks that challenge our perceptions of
                    creativity and technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="case-studies-items">
          <div className="case-studies-items-content col">
            <div className="case-studies-item case-studies-item-1">
              <div className="container">
                <h3>Art in the Age of Algorithms</h3>
                <p className="primary">[ Lumina Horizon — Zara Lee ]</p>
                <div className="case-studies-item-inner-img">
                  <img
                    src={resolveAssetPath("images/home/case-study-1.jpeg")}
                    alt="Futuristic AI-generated art"
                  />
                </div>
                <p>
                  Zara Lee’s AI-powered installation captivates audiences at the
                  Global Digital Arts Forum, raising questions about the fusion
                  of human intent and machine precision. The work highlights the
                  limitless potential of AI as a creative partner in the world
                  of modern art.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href={resolveAnchorHref("/archive")} prefetch={false}>
                    Discover the Journey
                  </Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="case-studies-item case-studies-item-2">
              <div className="container">
                <h3>The Dawn of AI-Driven Fashion</h3>
                <p className="primary">[ Visionary Threads — Elena Marquez ]</p>
                <div className="case-studies-item-inner-img">
                  <img
                    src={resolveAssetPath("images/home/case-study-2.jpeg")}
                    alt="AI-driven fashion design showcase"
                  />
                </div>
                <p>
                  Elena Marquez launches the first fashion magazine curated
                  entirely by AI, featuring futuristic designs and concepts that
                  redefine the boundaries of creativity. While widely praised
                  for its innovation, the magazine ignites debates over the role
                  of human designers in a machine-led creative process.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href={resolveAnchorHref("/archive")} prefetch={false}>
                    Read Full Story
                  </Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
            <div className="case-studies-item case-studies-item-3">
              <div className="container">
                <h3>The Rise of AI-Curated Art Awards</h3>
                <p className="primary">
                  [ Synthetic Realities — Sophia Armitage ]
                </p>
                <div className="case-studies-item-inner-img">
                      <img
                        src={resolveAssetPath("images/home/case-study-3.jpeg")}
                        alt="AI-curated artwork showcase"
                      />
                </div>
                <p>
                  Sophia Armitage’s groundbreaking AI-curated exhibition
                  highlights the creative potential of machine-generated art.
                  The event features photorealistic works of entirely fictional
                  subjects, sparking a discussion about bias, authenticity, and
                  AI’s role in shaping the future of artistic recognition.
                </p>
                <div className="case-studies-item-inner-link">
                  <Link href={resolveAnchorHref("/archive")} prefetch={false}>
                    Explore the Exhibit
                  </Link>
                  <div className="link-icon">
                    <MdArrowOutward size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="case-studies-items-images col">
            <div className="case-studies-img case-studies-img-1">
              <img
                src={resolveAssetPath("images/home/case-study-1.jpeg")}
                alt=""
              />
              <div className="hero-img-overlay"></div>
              <div className="case-studies-img-link">
                <Link href={resolveAnchorHref("/archive")} prefetch={false}>
                  <span>
                    (&nbsp; View Article <MdArrowOutward />
                    &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
            <div className="case-studies-img case-studies-img-2">
              <img
                src={resolveAssetPath("images/home/case-study-2.jpeg")}
                alt=""
              />
              <div className="hero-img-overlay"></div>
              <div className="case-studies-img-link">
                <Link href={resolveAnchorHref("/archive")} prefetch={false}>
                  <span>
                    (&nbsp; View Article <MdArrowOutward />
                    &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
            <div className="case-studies-img case-studies-img-3">
              <img
                src={resolveAssetPath("images/home/case-study-3.jpeg")}
                alt=""
              />
              <div className="hero-img-overlay"></div>
              <div className="case-studies-img-link">
                <Link href={resolveAnchorHref("/archive")} prefetch={false}>
                  <span>
                    (&nbsp; View Article <MdArrowOutward />
                    &nbsp;)
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="abstract-bg">
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
          <div className="strip"></div>
        </section>

        <section className="works" id="works">
          <div className="works-header">
            <div className="container">
              <ShuffleText
                as="h2"
                text="Timeless Art Through a New Lens"
                triggerOnScroll={true}
              />
            </div>
          </div>

          <div className="works-content">
            <div className="container">
              <div className="col">
                <p className="primary">[ Creative Explorations ]</p>
              </div>
              <div className="col">
                <div className="works-copy">
                  <h2>Can machines innovate Like Human Artists?</h2>
                  <p>
                    These experiments explore the potential of advanced AI
                    tools, such as Midjourney and DALL-E 3, to reimagine classic
                    masterpieces through unique and boundary-pushing prompts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="carousel">
          {carouselItems.map((item) => (
            <div
              key={item.id}
              id={`project-${item.id}`}
              className="project"
              style={{
                clipPath:
                  item.id === "01"
                    ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
                    : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              }}
            >
              <div className="project-bg">
                <img src={item.bg} alt="" />

                <div className="hero-img-overlay"></div>
                <div className="hero-img-gradient"></div>
              </div>
              <div className="project-main">
                <img src={item.main} alt="" />
              </div>
              <div className="project-header">
                <div className="project-id">
                  <h2>Archive {item.id}</h2>
                </div>
                <div className="project-whitespace"></div>
                <div className="project-title">
                  <h2>{item.title}</h2>
                </div>
              </div>
              <div className="project-info">
                <div className="project-url">
                  <Link href={item.url}>( The Journey )</Link>
                </div>
              </div>
              <Link
                href={item.url}
                className="project-overlay-link"
                aria-label={`View ${item.title} project`}
              />
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
}
