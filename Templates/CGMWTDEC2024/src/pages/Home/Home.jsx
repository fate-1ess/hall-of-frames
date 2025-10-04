import { useEffect, useState, useRef } from "react";
import "./Home.css";
import { Link } from "react-router";

import HeroGradient from "../../components/HeroGradient/HeroGradient";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import NavBar from "../../components/NavBar/NavBar";
import Cursor from "../../components/Cursor/Cursor";
import Transition from "../../components/Transition/Transition";
import withBase from "../../utils/assetPath";

import { projects } from "./projects";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ReactLenis from "@studio-freight/react-lenis";

import { HiArrowRight } from "react-icons/hi";
import { RiArrowRightDownLine } from "react-icons/ri";

const Home = () => {
  const manifestoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 0);

    return () => clearTimeout(scrollTimeout);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".footer",
      start: "top 80%",
      onEnter: () => {
        document.querySelector(".team").classList.add("light");
        document.querySelector(".footer").classList.add("light");
      },
      onLeaveBack: () => {
        document.querySelector(".team").classList.remove("light");
        document.querySelector(".footer").classList.remove("light");
      },
    });

    if (!isMobile) {
      gsap.set(".project", { opacity: 0.35 });
    }

    if (!isMobile) {
      const projects = document.querySelectorAll(".project");

      projects.forEach((project) => {
        const projectImg = project.querySelector(".project-img img");

        project.addEventListener("mouseenter", () => {
          gsap.to(project, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(projectImg, {
            scale: 1.2,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        project.addEventListener("mouseleave", () => {
          gsap.to(project, {
            opacity: 0.35,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(projectImg, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }

    const manifestoText = new SplitType(".manifesto-title h1", {
      types: ["words", "chars"],
      tagName: "span",
      wordClass: "word",
      charClass: "char",
    });

    const style = document.createElement("style");
    style.textContent = `
       .word {
         display: inline-block;
         margin-right: 0em;
       }
       .char {
         display: inline-block;
       }
     `;
    document.head.appendChild(style);

    gsap.set(manifestoText.chars, {
      opacity: 0.25,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top 35%",
        end: "bottom 75%",
        scrub: true,
        markers: false,
      },
    });

    manifestoText.chars.forEach((char, index) => {
      tl.to(
        char,
        {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        },
        index * 0.1
      );
    });

    gsap.to(".marquee-text", {
      scrollTrigger: {
        trigger: ".marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          const moveAmount = self.progress * -1000;
          gsap.set(".marquee-text", {
            x: moveAmount,
          });
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      manifestoText.revert();
      style.remove();
    };
  }, [isMobile]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const rows = document.querySelectorAll(".row");
    const isMobileView = window.innerWidth <= 900;

    const getStartX = (index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      return direction * (isMobileView ? 150 : 300);
    };

    if (rows.length > 0) {
      rows.forEach((row, index) => {
        const existingTrigger = ScrollTrigger.getAll().find(
          (st) => st.trigger === ".gallery" && st.vars?.targets === row
        );
        if (existingTrigger) {
          existingTrigger.kill();
        }

        const startX = getStartX(index);

        gsap.set(row, { x: startX });

        gsap.to(row, {
          scrollTrigger: {
            trigger: ".gallery",
            start: "top bottom",
            end: "bottom top",
            scrub: isMobileView ? 0.5 : 1,
            onUpdate: (self) => {
              const moveAmount = startX * (1 - self.progress);
              gsap.set(row, {
                x: moveAmount,
              });
            },
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);

  return (
    <ReactLenis root>
      <div className="home">
        <Cursor />
        <NavBar />
        <section className="hero" id="hero">
          <HeroGradient />
          <div className="header-container">
            <div className="header h-1">
              <h1>Made to Move,</h1>
              <h1>Built to Inspire</h1>
            </div>
            <div className="header h-2">
              <h1>Ideas Born,</h1>
              <h1>Boundaries Broken</h1>
            </div>
            <div className="header h-3">
              <h1>Nơi sáng tạo,</h1>
              <h1>Không giới hạn</h1>
            </div>
            <div className="header h-4">
              <h1>Where Vision Meets,</h1>
              <h1>Limitless Design</h1>
            </div>
          </div>
        </section>

        <section className="work" id="work">
          <div className="container">
            <div className="work-header">
              <HiArrowRight size={13} />
              <p>Selected projects</p>
            </div>

            <div className="projects">
              <div className="project-col">
                {projects
                  .filter((project) => project.column === 1)
                  .map((project) => (
                    <Link to="/work" key={project.id}>
                      <div className="project">
                        <div className="project-img">
                          <img
                            src={withBase(project.image)}
                            alt="Project Thumbnail"
                          />
                        </div>
                        <div className="project-name">
                          <h2>{project.title}</h2>
                        </div>
                        <div className="project-description">
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              <div className="project-col">
                {projects
                  .filter((project) => project.column === 2)
                  .map((project) => (
                    <Link to="/work" key={project.id}>
                      <div className="project">
                        <div className="project-img">
                          <img
                            src={withBase(project.image)}
                            alt="Project Thumbnail"
                          />
                        </div>
                        <div className="project-name">
                          <h2>{project.title}</h2>
                        </div>
                        <div className="project-description">
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-bg-img">
            <img src={withBase("cta/cta-bg.png")} alt="" />
          </div>
          <div className="cta-title">
            <p>Trusted by visionaries</p>
          </div>
          <div className="cta-header">
            <h2>
              Apple, Netflix, Gucci, Tesla, Uniqlo, Sephora, Google, Moët &
              Chandon, Spotify, BMW, Montblanc, Panasonic, Nespresso, L’Oréal,
              Samsung
            </h2>
          </div>
          <div className="cta-btn">
            <button>Discover more at origin.co</button>
          </div>
        </section>

        <section className="manifesto" id="manifesto" ref={manifestoRef}>
          <div className="container">
            <div className="manifesto-header">
              <HiArrowRight size={13} />
              <p>Manifesto</p>
            </div>
            <div className="manifesto-title">
              <h1>
                We challenge norms, embrace change, pioneer progress. We are
                innovators merging art and technology to craft experiences that
                surprise, delight, and evolve.
              </h1>
            </div>
          </div>
        </section>

        <section className="processes">
          <div className="container">
            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Integrate</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src={withBase("processes/icon-1.png")} alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    Rooted in creativity, Origin bridges cultures to craft
                    designs that transcend time and place. We thrive at the
                    intersection of ideas, uniting diverse perspectives into a
                    seamless vision.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Collaborate</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src={withBase("processes/icon-2.png")} alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    Creativity is a collective process. At Origin, collaboration
                    is our foundation—merging ideas, talents, and visions to
                    create experiences that resonate universally.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>Challenge</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src={withBase("processes/icon-3.png")} alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    We challenge conventions and redefine possibilities. At
                    Origin, we dare to push boundaries, delivering solutions
                    that are as bold as they are impactful.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-text">
            <h1>Explore the essence of Origin Studio</h1>
          </div>
        </div>

        <section className="showreel">
          <VideoPlayer />
        </section>

        <section className="about" id="about">
          <div className="container">
            <div className="about-col">
              <div className="about-header">
                <HiArrowRight size={13} />
                <p>Origin Spirit</p>
              </div>
              <div className="about-copy">
                <p>
                  The Origin Spirit embodies creativity without boundaries.
                  Whether you’re a lifelong dreamer, a new explorer, or someone
                  returning to familiar grounds, Origin welcomes those who dare
                  to imagine. Being part of Origin means embracing inspiration,
                  collaboration, and limitless potential.
                </p>
              </div>
            </div>
            <div className="about-col">
              <div className="cta-btn">
                <button>Discover more at origin.co</button>
              </div>
            </div>
          </div>
        </section>

        <section className="gallery">
          <div className="gallery-wrapper">
            <div className="row">
              <div className="img">
                <img src={withBase("marquee/img1.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img2.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img3.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img4.jpeg")} alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src={withBase("marquee/img5.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img6.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img7.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img8.jpeg")} alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src={withBase("marquee/img9.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img10.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img11.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img12.jpeg")} alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src={withBase("marquee/img13.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img14.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img15.jpeg")} alt="" />
              </div>
              <div className="img">
                <img src={withBase("marquee/img16.jpeg")} alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="team" id="team">
          <div className="container">
            <div className="team-header">
              <HiArrowRight />
              <p>Team</p>
            </div>

            <div className="team-intro">
              <h1>
                From corners of globe, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; we are
                united by &nbsp;&nbsp;&nbsp; creativity
              </h1>
            </div>

            <div className="team-member tm-1">
              <div className="team-member-position">
                <p>Lead Developer</p>
              </div>
              <div className="team-member-profile">
                <div className="team-member-img">
                  <img src={withBase("team/team-1.jpg")} alt="" />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Alex <br />
                      Johnson
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Alex is a skilled developer with expertise in modern web
                        technologies and a passion for creating seamless user
                        experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>(01)</p>
                <h1>Alex Johnson</h1>
              </div>
            </div>

            <div className="team-member tm-2">
              <div className="team-member-position">
                <p>UI/UX Designer</p>
              </div>
              <div className="team-member-profile">
                <div className="team-member-img">
                  <img src={withBase("team/team-2.jpg")} alt="" />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Sophia <br />
                      Martinez
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Sophia specializes in crafting intuitive and visually
                        appealing designs that bring digital products to life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>(02)</p>
                <h1>Sophia Martinez</h1>
              </div>
            </div>

            <div className="team-member tm-3">
              <div className="team-member-position">
                <p>Project Manager</p>
              </div>
              <div className="team-member-profile">
                <div className="team-member-img">
                  <img src={withBase("team/team-3.jpg")} alt="" />
                </div>
                <div className="team-member-info">
                  <div className="team-member-name">
                    <p>
                      Michael <br />
                      Brown
                    </p>
                  </div>
                  <div className="team-member-details">
                    <div className="team-member-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="team-member-copy">
                      <p>
                        Michael ensures projects are delivered on time and
                        within scope, maintaining excellent communication with
                        clients and the team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="team-member-index">
                <p>(03)</p>
                <h1>Michael Brown</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="footer" id="contact">
          <div className="container">
            <div className="footer-header">
              <HiArrowRight />
              <p>Contact</p>
            </div>

            <div className="footer-title">
              <h1>Keep in touch</h1>
            </div>

            <div className="footer-email">
              <p>We’d love to hear from you</p>
              <h2>hello@origin.co</h2>
            </div>

            <div className="footer-content">
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Our Spaces</p>
                </div>

                <div className="footer-col-content">
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>New York</h3>
                      <p>123 Creative Hub,</p>
                      <p>5th Avenue, Suite 101</p>
                      <p>New York, NY, 10010</p>
                      <p>USA</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>

                    <div className="location">
                      <h3>Tokyo</h3>
                      <p>Innovators Tower,</p>
                      <p>Shibuya City, 8th Floor</p>
                      <p>Tokyo, 150-0001</p>
                      <p>Japan</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>
                  </div>
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>London</h3>
                      <p>Design District,</p>
                      <p>Greenwich Peninsula</p>
                      <p>London, SE10 0ER</p>
                      <p>UK</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>

                    <div className="location">
                      <h3>Singapore</h3>
                      <p>Marina Bay Financial Center,</p>
                      <p>10 Marina Blvd, Tower 2</p>
                      <p>Singapore, 018983</p>
                      <p>Singapore</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Follow Us</p>
                </div>
                <div className="footer-sub-col">
                  <p>Instagram</p>
                  <p>LinkedIn</p>
                  <p>Twitter</p>
                  <p>Behance</p>
                  <p>Dribbble</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
