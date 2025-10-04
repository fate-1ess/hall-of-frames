import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/transition/Transition";
import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";
import MusicPlayer from "../../components/MusicPlayer/MusicPlayer";

import "./Home.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import { resolveAssetPath } from "../../utils/paths";

const Home = () => {
  const lenis = useLenis(({ scroll }) => {});

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".mix-tape",
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(".strip", {
          x: self.progress * 300,
        });
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <ReactLenis root>
      <div className="page home">
        <section className="hero">
          <div className="hero-img">
            <ParallaxImage src="/home/hero.jpg" alt="" />
          </div>

          <div className="hero-header">
            <h1>
              Balanced <br /> Pitch
            </h1>
            <p>Shaping the Future of Music with AI</p>
            <div className="stickers">
              <img src={resolveAssetPath("/stickers.png")} alt="" />
            </div>
            <button>
              <Link to="/contact">Get in touch</Link>
            </button>
          </div>

          <div className="news-article">
            <div className="news-article-title">
              <p className="primary">
                AI Disputes Ignite: Harmony <br /> or Discord Ahead?
              </p>
            </div>
            <div className="news-article-info">
              <p>7.1.2024</p>
              <p>News</p>
            </div>
          </div>
        </section>

        <section className="site-intro">
          <div className="intro-col">
            <p className="primary">Empowering Creativity. Redefining Sound.</p>
            <p>Shaping the Future of Music with AI</p>

            <MusicPlayer />
          </div>
          <div className="intro-col">
            <p>The music industry stands at a pivotal crossroads.</p>
            <h2>
              A New <br /> Gold Tech
            </h2>
            <h3>Innovation thrives, but artists are left behind.</h3>
            <p>
              AI is reshaping the landscape, leveraging the art we’ve poured our
              souls into—often without recognition or consent. At Balanced
              Pitch, we believe in harnessing AI's potential while fiercely
              protecting the artists at its heart. By collaborating with
              educators, legal pioneers, and industry leaders, we are building a
              future where creativity is respected, and artists’ rights are
              safeguarded.
            </p>
            <div className="intro-img">
              <div className="intro-img-wrapper">
                <ParallaxImage src="/home/site-intro.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="cover">
          <div className="cover-img">
            <ParallaxImage src="/home/cover.jpg" alt="" />
          </div>

          <div className="cover-copy">
            <h3>Committed For</h3>
            <h2>Creative AI</h2>
            <p>
              Balanced Pitch stands as a voice for artists, ensuring their
              creative legacy is valued and protected in an AI-driven world. Our
              mission is to establish a fair and respectful integration of
              artificial intelligence within the music industry, honoring the
              work and rights of creators at every step.
            </p>
            <br />
            <br />
            <p>
              By working with educators, legal specialists, industry innovators,
              and policymakers, we are driving the creation of ethical standards
              and advocating for robust policies that safeguard the future of
              artistry in the age of AI.
            </p>

            <div className="cover-cta">
              <button>
                <Link to="/">Our Mission</Link>
              </button>
            </div>
          </div>
        </section>

        <section className="mix-tape">
          <p className="primary">Responsible AI in Academia</p>
          <p>Balanced Pitch</p>

          <h1>
            From Innovation <br />
            To Iconic
          </h1>

          <div className="tape">
            <div className="strip">
              <img src={resolveAssetPath("/home/strip.png")} alt="" />
            </div>
            <div className="tape-img">
              <img src={resolveAssetPath("/home/tape.png")} alt="" />
            </div>
          </div>

          <div className="tape-info">
            <p>
              The next generation of data scientists and music creators is
              shaping the AI technologies that will define the future of the
              music industry.
            </p>
            <br />
            <br />
            <p>
              Balanced Pitch collaborates with universities and their music
              programs to promote awareness and establish ethical AI practices.
              We also offer opportunities for aspiring artists and data
              engineers to innovate and thrive in the evolving music landscape.
            </p>

            <div className="sticker">
              <img src={resolveAssetPath("/stickers-dark.png")} alt="" />
            </div>
          </div>
        </section>

        <section className="latest-updates">
          <h1>Latest Updates</h1>
          <p className="lp-tagline">
            Explore the latest updates, comprehensive guidelines, and valuable
            resources at the crossroads of AI innovation and the music industry.
          </p>

          <div className="updates-page-link">
            <Link to="/">View All Updates</Link>
          </div>

          <div className="articles-row">
            <div className="article">
              <div className="article-img">
                <ParallaxImage src="/updates/article1.jpg" alt="" speed={0.1} />
              </div>
              <div className="article-title">
                <h3>
                  The Fight for Authenticity: Tackling Unauthorized AI-Generated
                  Voices
                </h3>
              </div>
              <div className="article-link">
                <p className="primary">
                  <Link to="/">Read More</Link>
                </p>
              </div>
            </div>

            <div className="article">
              <div className="article-img">
                <ParallaxImage src="/updates/article2.jpg" alt="" speed={0.1} />
              </div>
              <div className="article-title">
                <h3>
                  Protecting Iconic Voices: The Struggle Against AI Imitation
                </h3>
              </div>
              <div className="article-link">
                <p className="primary">
                  <Link to="/">Read More</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
