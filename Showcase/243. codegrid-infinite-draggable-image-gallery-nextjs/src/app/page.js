"use client";

import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <>
      <nav>
        <div className="logo">
          <a href="#">Codegrid</a>
        </div>
        <div className="links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <div className="socials">
            <a href="#">FB</a>
            <a href="#">IG</a>
            <a href="#">YT</a>
          </div>
        </div>
      </nav>

      <footer>
        <p>Experiment 445</p>
        <p>Unlock Source Code with PRO</p>
      </footer>

      <Gallery />
    </>
  );
}
