"use client";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ReactLenis } from "lenis/react";

import AnimatedCopy from "@/components/AnimatedCopy";

export default function Home() {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <section className="hero">
        <img src="/intro.jpg" alt="" />
      </section>
      <section className="about">
        <div className="header">
          <h1>A new chapter in engineered systems</h1>
        </div>
        <div className="copy">
          <AnimatedCopy>
            <p>
              In an era defined by precision and speed, innovation reshapes the
              foundation of modern industry. Every component is built with
              intent, every system designed to perform at scale. This is more
              than machinery— it is the architecture of progress, setting new
              benchmarks for how we build, move, and connect.
            </p>
          </AnimatedCopy>
        </div>
      </section>
      <section className="banner-img">
        <img src="/img_1.jpg" alt="" />
      </section>
      <section className="services">
        <div className="service">
          <div className="col">
            <div className="service-copy">
              <h3>Precision Engineering</h3>
              <AnimatedCopy>
                <p>
                  Every breakthrough begins with detail. From the first sketch
                  to full-scale production, our engineering process is built on
                  accuracy, consistency, and performance. What you see isn’t
                  just a machine—it’s the sum of thousands of deliberate
                  calculations designed to set new standards in motion.
                </p>
              </AnimatedCopy>
            </div>
          </div>
          <div className="col">
            <img src="/img_2.jpg" alt="" />
          </div>
        </div>
        <div className="service">
          <div className="col">
            <img src="/img_3.jpg" alt="" />
          </div>
          <div className="col">
            <div className="service-copy">
              <h3>Performance Optimization</h3>
              <AnimatedCopy>
                <p>
                  True innovation means doing more with less. Our systems are
                  engineered to deliver maximum output while minimizing waste,
                  resistance, and downtime. Every detail is calibrated for
                  efficiency—turning raw energy into refined, sustainable power
                  that drives industries forward.
                </p>
              </AnimatedCopy>
            </div>
          </div>
        </div>
        <div className="service">
          <div className="col">
            <div className="service-copy">
              <h3>Advanced Mobility</h3>
              <AnimatedCopy>
                <p>
                  The future of movement is seamless. From high-speed transit to
                  autonomous systems, our mobility solutions are designed to
                  connect people, industries, and cities with unprecedented
                  speed and reliability. Every element is engineered for
                  flow—reducing delays, increasing capacity, and reshaping how
                  the world moves.
                </p>
              </AnimatedCopy>
            </div>
          </div>
          <div className="col">
            <img src="/img_4.jpg" alt="" />
          </div>
        </div>
        <div className="service">
          <div className="col">
            <img src="/img_5.jpg" alt="" />
          </div>
          <div className="col">
            <div className="service-copy">
              <h3>Next-Gen Infrastructure</h3>
              <AnimatedCopy>
                <p>
                  Building for tomorrow requires more than incremental change—it
                  demands infrastructure that can endure, adapt, and expand.
                  From aerospace systems to ground-level operations, our
                  solutions are designed to withstand extreme environments while
                  maintaining absolute precision.
                </p>
              </AnimatedCopy>
            </div>
          </div>
        </div>
      </section>
      <section className="outro">
        <h3>Innovation has no finish line.</h3>
      </section>
    </>
  );
}
