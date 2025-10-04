"use client";
import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const scrollTriggerSettings = {
      trigger: ".main",
      start: "top 25%",
      toggleActions: "play reverse play reverse",
    };

    const leftXValues = [-800, -900, -400];
    const rightXValues = [800, 900, 400];
    const leftRotationValues = [-30, -20, -35];
    const rightRotationValues = [30, 20, 35];
    const yValues = [100, -150, -400];

    gsap.utils.toArray(".row").forEach((row, index) => {
      const cardLeft = row.querySelector(".card-left");
      const cardRight = row.querySelector(".card-right");

      gsap.to(cardLeft, {
        x: leftXValues[index],
        scrollTrigger: {
          trigger: ".main",
          start: "top center",
          end: "150% bottom",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            cardLeft.style.transform = `translateX(${
              progress * leftXValues[index]
            }px) translateY(${progress * yValues[index]}px) rotate(${
              progress * leftRotationValues[index]
            }deg)`;
            cardRight.style.transform = `translateX(${
              progress * rightXValues[index]
            }px) translateY(${progress * yValues[index]}px) rotate(${
              progress * rightRotationValues[index]
            }deg)`;
          },
        },
      });
    });

    gsap.to(".logo", {
      scale: 1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: scrollTriggerSettings,
    });

    gsap.to(".line p", {
      y: 0,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.1,
      scrollTrigger: scrollTriggerSettings,
    });

    gsap.to("button", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out",
      delay: 0.25,
      scrollTrigger: scrollTriggerSettings,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className="row" key={i}>
          <div className="card card-left">
            <img
              src={`/img-${2 * i - 1}.jpg`}
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div className="card card-right">
            <img src={`/img-${2 * i}.jpg`} alt="" width={100} height={100} />
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <ReactLenis root>
      <section className="hero">
        <div className="img">
          <img src="/pro-logo.png" alt="" width={100} height={100} />
        </div>
      </section>

      <section className="main">
        <div className="main-content">
          <div className="logo">
            <img src="/logo.jpg" alt="" width={100} height={100} />
          </div>
          <div className="copy">
            <div className="line">
              <p>Delve into coding without clutter.</p>
            </div>
            <div className="line">
              <p>One subscription. Endless web design.</p>
            </div>
            <div className="line">
              <p>Take the fast lane to mastery.</p>
            </div>
          </div>
          <div className="btn">
            <button>Get PRO</button>
          </div>
        </div>

        {generateRows()}
      </section>

      <section className="footer">
        <Link href="youtube.com/codegrid">Link in description</Link>
      </section>
    </ReactLenis>
  );
}
