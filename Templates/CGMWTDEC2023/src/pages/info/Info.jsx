import React from "react";

import "./Info.css";

const Info = () => {
  return (
    <div className="info-page">
      <div className="whitespace-300"></div>
      <div className="container">
        <div className="info-row">
          <div className="info-col">
            <div className="info-contact">
              <p className="header">represented by</p>
              <p>none at nuance</p>
              <p>utopia@lagnuanceence.tv</p>
              <p>34 232 983 24</p>
            </div>
            <div className="info-copy">
              <p className="header">about</p>
              <p>
                My lifelong aspiration was to become a cartographer. Ever since
                I was young, I would sketch maps and envision vast terrains.
                There was always something deeply compelling about the visual
                aspect for me. As time went on, my interest evolved into
                storytelling. It was when I encountered the world of cinema and
                photography that things clicked for me. I realized that visual
                art and storytelling, the craft of map-making and narrative
                weaving, could converge in the creation of scripts and the birth
                of characters from the ground up. This marked the beginning of
                my dream turning into tangible reality.
              </p>
              <br />
              <p>
                Pursuing my education, I earned a degree in Film Studies. The
                enchanting and intricate world of cinema completely engulfed me.
                My fascination with fictional narratives grew profoundly during
                my time at EFTI’s International Film Master, where I delved
                deeper into the art form. It was a journey that further
                solidified my path and passion in the realm of visual
                storytelling.
              </p>
              <br />
              <p>
                Velasco Solari, a name that I came to embrace, became synonymous
                with my journey. My experiences at EFTI opened a myriad of
                opportunities where I could blend my early love for cartography
                with my newfound passion for cinema. Every script I wrote, every
                scene I envisioned, was a map of its own – a landscape of
                emotions, stories, and characters waiting to be navigated and
                explored. The amalgamation of my childhood dreams and my
                professional aspirations crafted a unique path that I walked
                with fervor and dedication, making each step a testament to my
                commitment to the art of visual and narrative storytelling.
              </p>
            </div>
          </div>
          <div className="info-col img">
            <div className="info-imgs"></div>
          </div>
        </div>
        <div className="info-row info-row-2">
          <div className="info-col">
            <div className="info-img-2">
              <div className="img-2"></div>
            </div>
          </div>
          <div className="info-col">
            <div className="info-contact-2">
              <p className="header">contact</p>
              <p>contact@velascoso.com</p>
              <p>23 234 234 23</p>
              <p>
                <a href="#">instagram</a>
              </p>
              <p>
                <a href="#">vimeo</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
