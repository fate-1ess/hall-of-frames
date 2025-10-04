import React from "react";
import WorkItem from "./workItem/WorkItem";
import Footer from "../footer/Footer";

import "./Work.css";

const Work = () => {
  return (
    <div className="work-page">
      <div className="whitespace-300"></div>
      <div className="container">
        <div className="works">
          <div className="row">
            <WorkItem
              videoId={437808118}
              index="01"
              workName="Azure Serenity Echoes"
            />
            <WorkItem videoId={871750630} index="02" workName="Solar Reverie" />
            <WorkItem
              videoId={477068055}
              index="03"
              workName="Crimson Symphony Memoirs"
            />
          </div>
          <div className="row">
            <WorkItem
              videoId={487114118}
              index="04"
              workName="Neon Galactic Chronicles"
            />
            <WorkItem
              videoId={366780994}
              index="05"
              workName="Velvet Dreamscape"
            />
            <WorkItem
              videoId={659334960}
              index="06"
              workName="Lunar Symphony"
            />
          </div>
          <div className="row">
            <WorkItem
              videoId={533729157}
              index="07"
              workName="Oceanic Memoirs Echoes"
            />
            <WorkItem
              videoId={500832353}
              index="08"
              workName="Twilight Dreamscape Saga"
            />
            <WorkItem
              videoId={510814675}
              index="09"
              workName="Galactic Odyssey"
            />
          </div>
        </div>
      </div>
      <div className="whitespace-300"></div>
      <Footer />
    </div>
  );
};

export default Work;
