"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray(".card");

    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const cardInner = card.querySelector(".card-inner");

        gsap.fromTo(
          cardInner,
          {
            y: "0%",
            z: 0,
            rotationX: 0,
          },
          {
            y: "-50%",
            z: -250,
            rotationX: 45,
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top 85%",
              end: "top -75%",
              scrub: true,
              pin: card,
              pinSpacing: false,
            },
          }
        );

        gsap.to(cardInner, {
          "--after-opacity": 1,
          scrollTrigger: {
            trigger: cards[index + 1],
            start: "top 75%",
            end: "top -25%",
            scrub: true,
          },
        });
      }
    });

    // Cleanup function
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <ReactLenis root>
        <section className="hero">
          <h1>Art That Lives Online</h1>
        </section>

        <section className="sticky-cards">
          <div className="card" id="card-1">
            <div className="card-inner">
              <div className="card-info">
                <p>A surreal dive into neon hues and playful decay</p>
              </div>
              <div className="card-title">
                <h1>Reverie</h1>
              </div>
              <div className="card-description">
                <p>
                  A psychedelic skull study exploring the tension between
                  playfulness and decay. Bold candy tones, liquid forms, and
                  crisp vectors bring a surreal, pop-art mood meant for covers
                  and prints.
                </p>
              </div>
              <div className="card-img">
                <img src="/img1.jpg" alt="Reverie artwork" />
              </div>
            </div>
          </div>

          <div className="card" id="card-2">
            <div className="card-inner">
              <div className="card-info">
                <p>A retro-futurist scene where nostalgia meets glitch</p>
              </div>
              <div className="card-title">
                <h1>Vaporwave</h1>
              </div>
              <div className="card-description">
                <p>
                  An 80s-UI dreamscape: stacked windows, checkerboard floors,
                  and a sunset gradient. Built to feel like a loading screen to
                  another world—nostalgic, glossy, and a bit uncanny.
                </p>
              </div>
              <div className="card-img">
                <img src="/img2.jpg" alt="Vaporwave artwork" />
              </div>
            </div>
          </div>

          <div className="card" id="card-3">
            <div className="card-inner">
              <div className="card-info">
                <p>A kaleidoscope of folk motifs reimagined in digital form</p>
              </div>
              <div className="card-title">
                <h1>Kaleido</h1>
              </div>
              <div className="card-description">
                <p>
                  Ornamental symmetry inspired by folk motifs and stained-glass
                  glow. Designed as a seamless, tileable pattern for textiles,
                  wallpapers, and rich UI backgrounds.
                </p>
              </div>
              <div className="card-img">
                <img src="/img3.jpg" alt="Kaleido artwork" />
              </div>
            </div>
          </div>

          <div className="card" id="card-4">
            <div className="card-inner">
              <div className="card-info">
                <p>A portrait framed by oddball creatures and doodles</p>
              </div>
              <div className="card-title">
                <h1>Menagerie</h1>
              </div>
              <div className="card-description">
                <p>
                  A playful portrait surrounded by oddball companions—mascots,
                  monsters, and midnight snacks. Loose linework meets pastel
                  whimsy, perfect for merch, stickers, and editorial spots.
                </p>
              </div>
              <div className="card-img">
                <img src="/img4.jpg" alt="Menagerie artwork" />
              </div>
            </div>
          </div>
        </section>

        <section className="outro">
          <h1>Next Canvas Awaits</h1>
        </section>
      </ReactLenis>
    </>
  );
}
