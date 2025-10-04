import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/transition/Transition";
import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";

import "./About.css";

import { ReactLenis, useLenis } from "lenis/react";
import { resolveAssetPath } from "../../utils/paths";

const About = () => {
  const lenis = useLenis(({ scroll }) => {});

  return (
    <ReactLenis root>
      <div className="page about">
        <section className="solutions-hero about-hero">
          <div className="solutions-hero-img">
            <ParallaxImage src="/about/hero.jpg" alt="" />
          </div>
          <div className="solutions-hero-header about-hero-header">
            <h1>Our Story</h1>
            <div className="stickers">
              <img src={resolveAssetPath("/stickers.png")} alt="" />
            </div>
          </div>
          <div className="about-hero-info">
            <p>Championing Artists’ Rights and Defining Ethical AI Standards</p>
          </div>
        </section>
        <section className="about-us">
          <div className="about-us-col">
            <div className="sign-up-card">
              <div className="sign-up-img">
                <ParallaxImage src="/about/sign-up-card.jpg" alt="" />
              </div>
              <div className="sign-up-card-header">
                <h3>
                  Stand with us for ethical AI in music. Add your name today!
                </h3>
                <p>Every Voice Counts</p>
              </div>
              <div className="sign-up-cta">
                <button>
                  <Link to="/">Sign Up</Link>
                </button>
              </div>
            </div>
          </div>
          <div className="about-us-col">
            <h3>
              As musicians and artists, mainly our mission is to ensure future
              generations can thrive in a music industry shaped by AI.
            </h3>
            <p>
              At Balanced Pitch, we advocate for artists' rights and establish
              ethical AI standards. Collaborating with universities, we engage
              with music and data science programs to empower the next wave of
              creators and innovators. We pioneer solutions in ethical licensing
              and AI rights management, actively testing our ideas by fostering
              talent, producing music, and embracing AI to shape the future of
              sound.
            </p>

            <div className="about-us-cta">
              <button>
                <Link to="/contact">Talk to us</Link>
              </button>
            </div>
          </div>
        </section>

        <section className="team">
          <div className="team-bg">
            <ParallaxImage src="/about/team-bg.jpg" alt="" />
          </div>
          <div className="team-header">
            <h3>The Balanced</h3>
            <h1>Team</h1>
            <div className="join-team-card">
              <h3>Be Part of Our Journey</h3>
              <p>
                At Balanced Pitch, we champion a collaborative and adaptive
                approach, empowering our team to innovate and thrive in the
                fast-evolving world of AI.
              </p>

              <div className="join-team-cta">
                <button>
                  <Link to="/">Careers</Link>
                </button>
              </div>
            </div>
          </div>
          <div className="team-list">
            <div className="team-list-row">
              <div className="team-player">
                <div className="player-img">
                  <ParallaxImage
                    src="/about/team1.jpg"
                    alt="Team member 1"
                    speed={0.1}
                  />
                </div>
                <div className="player-info">
                  <h3>Alex Morgan</h3>
                  <p>Co-Founder & CEO</p>
                </div>
                <div className="player-desc">
                  <p>
                    Alex brings over three decades of experience in the music
                    industry, combining a career as a composer, producer, and
                    innovator. With a deep commitment to artists' rights, Alex
                    leads Balanced Pitch in shaping a fair and sustainable
                    future for music in the AI era.
                  </p>
                </div>
                <div className="player-social">
                  <Link to="/">LinkedIn</Link>
                </div>
              </div>
              <div className="team-player">
                <div className="player-img">
                  <ParallaxImage
                    src="/about/team2.jpg"
                    alt="Team member 2"
                    speed={0.1}
                  />
                </div>
                <div className="player-info">
                  <h3>Jordan Lee</h3>
                  <p>Chief Technology Officer</p>
                </div>
                <div className="player-desc">
                  <p>
                    Jordan is a tech visionary with a passion for innovation in
                    music and AI. With a background in software development and
                    a love for music, Jordan drives our technical strategies to
                    ensure ethical AI integration in the industry.
                  </p>
                </div>
                <div className="player-social">
                  <Link to="/">LinkedIn</Link>
                </div>
              </div>
            </div>
            <div className="team-list-row">
              <div className="team-player">
                <div className="player-img">
                  <ParallaxImage
                    src="/about/team3.jpg"
                    alt="Team member 3"
                    speed={0.1}
                  />
                </div>
                <div className="player-info">
                  <h3>Samantha Grey</h3>
                  <p>Head of Artist Advocacy</p>
                </div>
                <div className="player-desc">
                  <p>
                    Samantha has spent her career championing the rights of
                    creators. With a deep understanding of the music business,
                    she works tirelessly to ensure artists' voices are heard and
                    protected in the ever-evolving digital landscape.
                  </p>
                </div>
                <div className="player-social">
                  <Link to="/">LinkedIn</Link>
                </div>
              </div>
              <div className="team-player">
                <div className="player-img">
                  <ParallaxImage
                    src="/about/team4.jpg"
                    alt="Team member 4"
                    speed={0.1}
                  />
                </div>
                <div className="player-info">
                  <h3>Riley Bennett</h3>
                  <p>Director of Partnerships</p>
                </div>
                <div className="player-desc">
                  <p>
                    Riley specializes in forging connections between Balanced
                    Pitch and key industry players. With a background in music
                    and business development, Riley ensures our partnerships
                    align with our mission to protect and empower creators.
                  </p>
                </div>
                <div className="player-social">
                  <Link to="/">LinkedIn</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-marquee">
          <div className="marquee_container">
            <div className="marquee">
              <h1>Innovate Music</h1>
              <h1>Empower Artists</h1>
              <h1>Ethical AI</h1>
              <h1>Innovate Music</h1>
              <h1>Empower Artists</h1>
              <h1>Ethical AI</h1>
              <h1>Innovate Music</h1>
              <h1>Empower Artists</h1>
              <h1>Ethical AI</h1>
            </div>
            <div className="marquee">
              <h1>Innovate Music</h1>
              <h1>Empower Artists</h1>
              <h1>Ethical AI</h1>
              <h1>Innovate Music</h1>
              <h1>Empower Artists</h1>
              <h1>Ethical AI</h1>
              <h1>Innovate Music</h1>
              <h1>Empower Artists</h1>
              <h1>Ethical AI</h1>
            </div>
          </div>
        </section>

        <section className="services">
          <div className="service-row">
            <div className="service-title">
              <h3>01.</h3>
              <h3>Respecting Creative Ownership</h3>
            </div>
            <div className="service-desc">
              <p>AI Training Starts With Permission</p>
              <p>
                We prioritize clear consent and transparency when it comes to
                training AI models. Our mission is to honor the creative legacy
                and rights of human artists as technology evolves.
              </p>
            </div>
          </div>
          <div className="service-row">
            <div className="service-title">
              <h3>02.</h3>
              <h3>Driving Innovation Through Unity</h3>
            </div>
            <div className="service-desc">
              <p>Action Beyond Legislation</p>
              <p>
                While advocating for supportive policies, we focus on collective
                industry efforts to develop ethical frameworks and
                self-regulation, ensuring responsible AI innovation.
              </p>
            </div>
          </div>
          <div className="service-row">
            <div className="service-title">
              <h3>03.</h3>
              <h3>Establishing AI Rights Standards</h3>
            </div>
            <div className="service-desc">
              <p>Metadata Is the Foundation of Fair AI</p>
              <p>
                Setting global standards for AI rights ensures proper
                attributions and respect for training data. We collaborate with
                industry leaders to develop open frameworks that balance
                innovation with ethical responsibility.
              </p>
            </div>
          </div>
          <div className="service-row">
            <div className="service-title">
              <h3>04.</h3>
              <h3>Empowering Ethical AI Awareness</h3>
            </div>
            <div className="service-desc">
              <p>Knowledge Transforms the Industry</p>
              <p>
                We are dedicated to educating artists, technologists, and the
                public on the intersection of AI and music, equipping everyone
                with the tools to advocate for fair practices.
              </p>
            </div>
          </div>
        </section>

        <section className="contact-banner">
          <div className="contact-banner-col">
            <div className="contact-banner-header">
              <h2>
                Balanced <br />
                Pitch Inc.
              </h2>
              <p className="primary">
                123 Harmony Lane, Los Angeles, CA 90210, USA
              </p>
            </div>

            <div className="banner-contact">
              <p className="primary">Info@balancedpitch.com</p>
              <p>Established 2024</p>
            </div>
            <div className="banner-info">
              <p>
                Balanced Pitch provides expertly crafted datasets for machine
                learning, enriched with detailed attribution metadata and
                cutting-edge AI-ready features to ensure ethical and innovative
                solutions.
              </p>
            </div>
          </div>
          <div className="contact-banner-col">
            <div className="contact-banner-img">
              <ParallaxImage
                src="/about/banner.jpg"
                alt="Balanced Pitch Banner"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(About);
