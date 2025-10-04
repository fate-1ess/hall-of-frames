import React from "react";
import Footer from "../../components/Footer/Footer";
import Transition from "../../components/transition/Transition";
import ParallaxImage from "../../components/ParallaxImage/ParallaxImage";

import "./Solutions.css";

import { ReactLenis, useLenis } from "lenis/react";
import { resolveAssetPath } from "../../utils/paths";

const Solutions = () => {
  const lenis = useLenis(({ scroll }) => {});

  return (
    <ReactLenis root>
      <div className="page solutions">
        <section className="solutions-hero about-hero">
          <div className="solutions-hero-img">
            <ParallaxImage src="/solutions/hero.jpg" alt="" />
          </div>
          <div className="solutions-hero-header about-hero-header">
            <h1>Solutions</h1>
            <div className="stickers">
              <img src={resolveAssetPath("/stickers.png")} alt="" />
            </div>
          </div>
          <div className="solutions-hero-info">
            <p className="primary">Balanced Pitch Data</p>
            <p className="primary">Academia & Innovation</p>
            <p className="primary">AI Ethics</p>
            <p className="primary">Harmony API</p>
          </div>
        </section>

        <section className="contact-banner">
          <div className="contact-banner-col">
            <div className="contact-banner-header">
              <h2>
                Empowering <br />
                Through Innovation
              </h2>
              <p className="primary">
                Shaping the future of music with ethical AI solutions.
              </p>
            </div>

            <div className="banner-contact">
              <p className="primary">Support@balancedpitch.com</p>
              <p>Established 2024</p>
            </div>
            <div className="banner-info">
              <p>
                We believe in a harmonious balance between creativity and
                technology. By championing artists’ rights and fostering ethical
                AI practices, we’re paving the way for a new era in the music
                industry.
              </p>
            </div>
          </div>
          <div className="contact-banner-col">
            <div className="contact-banner-img">
              <ParallaxImage
                src="/solutions/banner.jpg"
                alt="Empowering Creators Through Innovation"
              />
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-header">
            <div className="features-col">
              <img
                src={resolveAssetPath("/solutions/text-bg.png")}
                alt="Machine Learning Training Data"
              />
              <h3>
                Ethical AI <br /> Training Data
              </h3>
            </div>
            <div className="features-col">
              <img
                src={resolveAssetPath("/solutions/text-bg.png")}
                alt="Artist Attribution"
              />
              <h3>
                Creative Rights <br />
                Attribution
              </h3>
            </div>
          </div>
          <div className="features-copy">
            <div className="features-col feature-title">
              <p>01.</p>
              <p>Artist Recognition</p>
            </div>
            <div className="features-col feature-copy">
              <p>
                Comprehensive metadata ensures that every creator and rights
                holder is properly credited for their contributions.
              </p>
            </div>
          </div>
          <div className="features-copy">
            <div className="features-col feature-title">
              <p>02.</p>
              <p>Data Optimization</p>
            </div>
            <div className="features-col feature-copy">
              <p>
                Our advanced tools extract intricate details from audio files,
                enabling data scientists to work with rich, high-quality
                datasets for innovative AI applications.
              </p>
            </div>
          </div>
          <div className="features-copy">
            <div className="features-col feature-title">
              <p>03.</p>
              <p>Access Control</p>
            </div>
            <div className="features-col feature-copy">
              <p>
                Strict permissions ensure that data is accessible only to
                authorized individuals, maintaining legal and ethical compliance
                at all times.
              </p>
            </div>
          </div>
          <div className="features-copy">
            <div className="features-col feature-title">
              <p>04.</p>
              <p>Insights & Reporting</p>
            </div>
            <div className="features-col feature-copy">
              <p>
                Gain clear insights with detailed reports on dataset usage,
                fostering accountability and transparency across all
                stakeholders.
              </p>
            </div>
          </div>
          <div className="features-copy">
            <div className="features-col feature-title">
              <p>05.</p>
              <p>Standards & Integrity</p>
            </div>
            <div className="features-col feature-copy">
              <p>
                Our reporting framework sets the benchmark for transparent data
                sourcing, ensuring all processes adhere to rigorous ethical and
                compliance standards.
              </p>
            </div>
          </div>
        </section>

        <section className="solutions-callout">
          <div className="callout-bg">
            <ParallaxImage
              src="/solutions/callout-bg.jpg"
              alt="Ethical AI Callout Background"
            />
          </div>

          <div className="callout-copy">
            <h2>
              Responsible <br /> for Creativity <br /> and Beyond
            </h2>
            <p>
              Be part of a movement that values creativity, respects artistic
              contributions, and pioneers ethical AI practices in the music
              industry and beyond.
            </p>
            <br />
            <p>
              In a rapidly advancing digital era, the unchecked use of creative
              works by AI companies raises significant ethical concerns. Without
              proper authorization or transparency, the origin and ownership of
              datasets are often ignored, compromising the rights of artists and
              introducing complex legal challenges.
            </p>
          </div>
        </section>

        <section className="rights">
          <h1>AI Rights</h1>
          <h3>Advocating for Justice</h3>

          <p className="tagline">Enabling artists to safeguard and thrive.</p>
          <p>
            By partnering with legal pioneers and industry leaders, we deliver
            innovative solutions to reclaim lost revenue, prevent unauthorized
            use, and actively protect your music and intellectual property in an
            evolving digital landscape.
          </p>
        </section>

        <section className="rights-list">
          <div className="right">
            <div className="right-index">
              <p>(01)</p>
            </div>
            <div className="right-title">
              <h3>Define Your Rules</h3>
            </div>
            <div className="right-desc">
              <div className="right-desc-line">
                <p>Control your music</p>
              </div>
              <div className="right-desc-line">
                <p>Protect your voice</p>
              </div>
              <div className="right-desc-line">
                <p>Secure your image</p>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="right-index">
              <p>(02)</p>
            </div>
            <div className="right-title">
              <h3>Protect Your Rights</h3>
            </div>
            <div className="right-desc">
              <div className="right-desc-line">
                <p>Track misuse</p>
              </div>
              <div className="right-desc-line">
                <p>Enforce compliance</p>
              </div>
              <div className="right-desc-line">
                <p>Prevent exploitation</p>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="right-index">
              <p>(03)</p>
            </div>
            <div className="right-title">
              <h3>Shape Your Legacy</h3>
            </div>
            <div className="right-desc">
              <div className="right-desc-line">
                <p>Monetize ethically</p>
              </div>
              <div className="right-desc-line">
                <p>Leverage AI responsibly</p>
              </div>
              <div className="right-desc-line">
                <p>Build your future</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-banner">
          <div className="contact-banner-col">
            <div className="contact-banner-header">
              <h2>
                Shaping <br />
                Tomorrow’s Sound
              </h2>
              <p className="primary">
                Empowering creativity through ethical AI innovation.
              </p>
            </div>

            <div className="banner-contact">
              <p className="primary">Contact@balancedpitch.com</p>
              <p>Founded in 2024</p>
            </div>
            <div className="banner-info">
              <p>
                At Balanced Pitch, we specialize in providing ethically curated
                datasets enriched with detailed attribution metadata and
                advanced AI-ready features, supporting innovation while
                protecting creative rights.
              </p>
            </div>
          </div>
          <div className="contact-banner-col">
            <div className="contact-banner-img">
              <ParallaxImage
                src="/solutions/banner2.jpg"
                alt="Balanced Pitch Innovation"
              />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Transition(Solutions);
