import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { LocomotiveScrollProvider } from 'react-locomotive-scroll';

import transition from "../transition";
import ProjectHeroImg from "../../assets/project-img-1.jpg"
import ProjectImg from "../../assets/project-img.jpg"
import ProjectPageImg2 from "../../assets/project-page-img-2.jpg"
import ProjectPageImg3 from "../../assets/project-img-2.jpg"

import "./Project.css"

const Project = () => {
  const containerRef = useRef(null);
  const [time, setTime] = useState(getCurrentTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours} : ${minutes} : ${seconds}`;
  }
  
  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        smartphone: {
          smooth: true
        },
        tablet: {
          smooth: true
        }
      }}
      watch={[]}
      containerRef={containerRef}
    >
    <div className="project-wrapper" data-scroll-container ref={containerRef} id="scroll-container">
      <section className="project-type" data-scroll-section>
        <div className="project-type-copy">
          <span>Project Name</span>
          <span>Category</span>
          <span>Company</span>
          <span>2050</span>
        </div>
      </section>

      <section className="project-hero" data-scroll-section>
       <div className="project-hero-img">
          <img src={ProjectHeroImg} alt="" />
       </div>
      </section>

      <section className="project-overview" data-scroll-section>
        <div className="project-overview-copy">
        <div className="project-overview-copy-p">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem quidem possimus nulla sapiente sit numquam optio placeat nam ducimus? Aspernatur.</p>
            <br />
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur delectus eos odit, vel esse rerum. Porro ea animi similique. Omnis, doloribus tenetur ea hic est quod sed quisquam porro id veniam minima fugit reprehenderit, laudantium dolores. Iusto, sint nobis! Eius.</p>
          </div>
          <div className="project-overview-ws"></div>
          <div className="project-overview-copy-h1">
            <h1>Lorem ipsum dolor sit amet consectetur</h1>
          </div>
          
        </div>
      </section>

      <section className="project-img-full" data-scroll-section>
        <div className="project-img-full-wrapper">
          <img src={ProjectImg} alt="" />
        </div>
      </section>

      <section className="project-overview" data-scroll-section>
        <div className="project-overview-copy">
        <div className="project-overview-copy-p">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos aliquid sed maxime alias, ipsam dolorem dolores nisi. Maiores quis debitis fuga nihil magnam, libero, esse quibusdam repellendus tenetur, impedit amet. Fugit sunt soluta est distinctio officiis qui earum illum facere amet, mollitia odit temporibus corporis velit illo molestias, ipsam consectetur!</p>
            </div>
            <div className="project-overview-ws"></div>
          <div className="project-overview-copy-h1">
            <h1>Lorem ipsum dolor sit Lorem, ipsum</h1>
          </div>
          
        </div>
      </section>

      <section className="project-img-full" data-scroll-section>
        <div className="project-img-full-wrapper">
          <img src={ProjectPageImg2} alt="" />
        </div>
      </section>

      <section className="project-info" data-scroll-section>
        <div className="project-info-copy">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium officiis pariatur repudiandae qui aspernatur quidem voluptatum, voluptates commodi maiores ipsa nostrum, dolores animi iste debitis consequatur ut. Ullam odit corporis amet eligendi officiis tempora dicta! Modi quibusdam obcaecati fugiat vel, soluta ipsa dolorem, animi asperiores, recusandae delectus reiciendis quaerat earum.</p>
          <br />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt eveniet ullam laboriosam atque veritatis necessitatibus sit nobis ab provident nisi illo molestiae velit vero pariatur vel sed, facilis optio? Nesciunt!</p>
        </div>
        <div className="project-info-img">
          <img src={ProjectPageImg3} alt="" />
        </div>
      </section>

      <section className="project-img-full" data-scroll-section>
        <div className="project-img-full-wrapper">
          <img src={ProjectImg} alt="" />
        </div>
      </section>

      <section className="project-overview" data-scroll-section>
        <div className="project-overview-copy">
          
          <div className="project-overview-copy-p">
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Perferendis quibusdam sequi impedit et quidem reprehenderit inventore, ipsam eveniet cumque incidunt obcaecati optio suscipit vel voluptates corporis, velit nihil corrupti ducimus!</p>
          </div>
          <div className="project-overview-ws"></div>
          <div className="project-overview-copy-h1">
            <h1><a href="#"><u>projecturl.com</u></a></h1>
          </div>
        </div>
      </section>

      <section className="projects discover" data-scroll-section>
        <div className="projects-copy">
          <div className="projects-copy-h1">
            <h1>Find more projects</h1>
          </div>
          <div className="projects-copy-ws"></div>
        </div>
        <div className="projects-list">
          <Link to="/sample-project-page">
            <div className="project">
              <div className="project-img project-img-3"></div>
              <div className="project-name">
                <p>Project Name &#8599;</p>
              </div>
              <div className="project-category">
                <p>Project Category</p>
              </div>
            </div>
          </Link>
          <Link to="/sample-project-page">
            <div className="project">
              <div className="project-img project-img-4"></div>
              <div className="project-name">
                <p>Project Name &#8599;</p>
              </div>
              <div className="project-category">
                <p>Project Category</p>
              </div>
            </div>
          </Link>
        </div>
        </section>

        <section className="footer" data-scroll-section>
        <div className="footer-copy">
          <div className="footer-copy-h1">
            <a href="#">
              <h1>Contact</h1>
            </a>
          </div>
          <div className="footer-copy-text">
            <p>Digital creative studio</p>
            <br />
            <p><a href="#">Twitter</a> • <a href="#">Instagram</a> • <a href="#">LinkedIn</a></p>
            <br />
            <p>Toronto, CA {time}</p>
          </div>
        </div>
      </section>
    </div>
    </LocomotiveScrollProvider>
  );
};

export default transition(Project);