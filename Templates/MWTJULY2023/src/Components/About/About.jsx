import { React, useState, useEffect, useRef } from "react";

import transition from "../transition";
import AboutHero from "../../assets/about-hero.jpg";
import AboutFeature from "../../assets/about-feature.jpg";
import Office from "../../assets/about-office.jpg";

import { LocomotiveScrollProvider } from "react-locomotive-scroll";

import "./About.css";

const About = () => {
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
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours} : ${minutes} : ${seconds}`;
  }

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
        },
      }}
      watch={[]}
      containerRef={containerRef}
    >
      <div
        className="about smooth-scroll"
        data-scroll-container
        ref={containerRef}
        id="scroll-container"
      >
        <section className="hero-img" data-scroll-section>
          <div className="hero-img-container">
            <img src={AboutHero} alt="" />
          </div>
        </section>

        <section className="about-us" data-scroll-section>
          <div className="about-us-copy">
            <div className="about-us-copy-p">
              <span>About Us</span>
              <br />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Voluptatem voluptatum, maiores minus id, minima molestiae veniam
                distinctio expedita pariatur ad dignissimos ipsum maxime ea
                perspiciatis tenetur? Ullam non culpa neque?{" "}
              </p>
              <br />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quibusdam sapiente eveniet hic, qui laboriosam fuga, dolore
                nulla eos voluptatum cupiditate laborum sed aperiam ullam esse
                soluta? Veniam recusandae vitae nam ex officia quas molestias
                velit, suscipit, odio saepe error quidem sapiente. Nulla esse
                dolorem totam quam adipisci at. Nostrum, similique.
              </p>
              <br />
            </div>
            <div className="about-us-copy-p">
              <span>Unusual Designs</span>
              <span>Digital Creative Studio</span>
              <span>Toronto 0982</span>
              <span>0912 King street</span>
              <br />
              <span>
                <a href="#">hi@boring.studio</a>
              </span>
            </div>
          </div>
        </section>

        <section id="about-sticky-wrap" data-scroll-section>
          <div
            className="about-sticky about-sticky-1"
            data-scroll
            data-scroll-sticky
            data-scroll-target="#about-sticky-wrap"
          >
            <div className="sticky-content">
              <div className="sitcky-content-h1">
                <h1 className="num">1</h1>
              </div>
              <div className="sitcky-content-h1">
                <h1>Design:</h1>
                <h1>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                  nulla aliquam tempore totam quo quas tempora ut exercitationem
                  laboriosam veritatis.
                </h1>
              </div>
            </div>
          </div>
          <div className="about-sticky about-sticky-2">
            <div className="sticky-content">
              <div className="sitcky-content-h1">
                <h1 className="num">2</h1>
              </div>
              <div className="sitcky-content-h1">
                <h1>Development:</h1>
                <h1>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
                  temporibus, iste magni voluptatum quas earum aut minima
                  officiis?
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-img" data-scroll-section>
          <div className="hero-img-container">
            <img src={AboutFeature} alt="" />
          </div>
        </section>

        <section className="more-clients" data-scroll-section>
          <div className="more-clients-h1">
            <h1>We've worked with</h1>
          </div>
          <div className="more-clients-logos">
            <div className="more-clients-logo">LOGO 1</div>
            <div className="more-clients-logo">LOGO 2</div>
            <div className="more-clients-logo">LOGO 3</div>
            <div className="more-clients-logo">LOGO 4</div>
            <div className="more-clients-logo">LOGO 5</div>
            <div className="more-clients-logo">LOGO 6</div>
            <div className="more-clients-logo">LOGO 7</div>
            <div className="more-clients-logo">LOGO 8</div>
            <div className="more-clients-logo">LOGO 9</div>
          </div>
        </section>

        <section className="about-us office" data-scroll-section>
          <div className="hero-img-container">
            <img src={Office} alt="" />
          </div>
          <div className="about-us-copy">
            <div className="about-us-copy-p">
              <span>Unusual Designs</span>
              <span>Digital Creative Studio</span>
              <span>Toronto 0982</span>
              <span>0912 King street</span>
              <br />
              <span>
                <a href="#">hi@boring.studio</a>
              </span>
            </div>
            <div className="about-us-copy-h1">
              <h1 id="office">Workplace</h1>
            </div>
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
              <p>
                <a href="#">Twitter</a> • <a href="#">Instagram</a> •{" "}
                <a href="#">LinkedIn</a>
              </p>
              <br />
              <p>Toronto, CA {time}</p>
            </div>
          </div>
        </section>
      </div>
    </LocomotiveScrollProvider>
  );
};

export default transition(About);
