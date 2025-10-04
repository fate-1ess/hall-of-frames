import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";

import "./Projects.css";

import Transition from "../../components/transition/Transition";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import ProjectImg1 from "../../assets/projects/project1.jpg";
import ProjectImg2 from "../../assets/projects/project2.jpg";
import ProjectImg3 from "../../assets/projects/project3.jpg";
import ProjectImg4 from "../../assets/projects/project4.jpg";
import ProjectImg5 from "../../assets/projects/project5.jpg";
import ProjectImg6 from "../../assets/projects/project6.jpg";

const Projects = () => {
  const [projectList, setProjectList] = useState([]);
  const containerRef = useRef(null);
  const lenis = useLenis(({ scroll }) => {});

  const projects = [
    {
      name: "Revive",
      category: "Brand Identity",
      img: ProjectImg1,
    },
    {
      name: "Echoes of Light",
      category: "Digital Illustration",
      img: ProjectImg2,
    },
    {
      name: "Urban Symphony",
      category: "Environmental Design",
      img: ProjectImg3,
    },
    {
      name: "Fragmented Reality",
      category: "3D Animation",
      img: ProjectImg4,
    },
    {
      name: "Luminous Flux",
      category: "Motion Graphics",
      img: ProjectImg5,
    },
    {
      name: "Reflections",
      category: "Interactive Media",
      img: ProjectImg6,
    },
  ];

  useEffect(() => {
    const initialSet = Array(30)
      .fill()
      .flatMap((_, i) =>
        projects.map((project, j) => ({
          ...project,
          name: `${project.name}`,
          id: i * projects.length + j,
        }))
      );
    setProjectList(initialSet);
  }, []);

  useEffect(() => {
    if (containerRef.current && projectList.length > 0) {
      ScrollTrigger.create({
        scroller: containerRef.current,
        start: 0,
        end: "max",
        onLeave: (self) => {
          self.scroll(1);
          ScrollTrigger.update();
        },
        onLeaveBack: (self) => {
          self.scroll(ScrollTrigger.maxScroll(containerRef.current) - 1);
          ScrollTrigger.update();
        },
      });

      const projectItems =
        containerRef.current.querySelectorAll(".project-item");
      projectItems.forEach((item) => {
        gsap.to(item, {
          opacity: 1,
          repeat: 1,
          yoyo: true,
          ease: "none",
          scrollTrigger: {
            scroller: containerRef.current,
            trigger: item,
            start: "center bottom",
            end: "center top",
            scrub: true,
          },
        });
      });
    }
  }, [projectList]);

  return (
    <ReactLenis root>
      <div
        className="projects"
        ref={containerRef}
        style={{
          height: "100vh",
          //  overflowY: "auto"
          // to enable infinite scrolling, uncomment `overflowY: "auto"` and remove the <ReactLenis root> component from root
        }}
      >
        <div className="container">
          {projectList.map((project) => (
            <div className="row" key={project.id}>
              <div className="project-item">
                <div className="project-img">
                  <Link to="/sample-project">
                    <img src={project.img} alt="" />
                  </Link>
                </div>
                <div className="project-details">
                  <p id="project-name"> &#x2192; {project.name}</p>
                  <p id="project-category">{project.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(Projects);
