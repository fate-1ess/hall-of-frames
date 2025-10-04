import React, { useState } from "react";
import Footer from "../footer/Footer";

import "./Overview.css";

const Overview = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const projects = [
    {
      title: "Azure Serenity",
      category: "Commercial",
      "running time": `53"`,
      year: 2021,
    },
    {
      title: "Crimson Symphony Memoirs",
      category: "Music",
      "running time": `03' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 17"`,
      year: 2017,
    },
    {
      title: "Velvet Dreamscape",
      category: "Narrative",
      "running time": `02' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 42"`,
      year: 2020,
    },
    {
      title: "Azure Serenity",
      category: "Commercial",
      "running time": `53"`,
      year: 2021,
    },
    {
      title: "Crimson Symphony Memoirs",
      category: "Music",
      "running time": `03' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 17"`,
      year: 2017,
    },
    {
      title: "Velvet Dreamscape",
      category: "Narrative",
      "running time": `02' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 42"`,
      year: 2020,
    },
    {
      title: "Crimson Symphony Memoirs",
      category: "Music",
      "running time": `03' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 17"`,
      year: 2017,
    },
    {
      title: "Velvet Dreamscape",
      category: "Narrative",
      "running time": `02' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 42"`,
      year: 2020,
    },
  ];

  return (
    <div className="overview-page">
      <div className="whitespace-300"></div>
      <div className="table">
        <div className="t-row" id="table-header">
          <div className="index">
            <p>#</p>
          </div>
          <div className="title">
            <p>Title</p>
          </div>
          <div className="category">
            <p>Category</p>
          </div>
          <div className="time">
            <p>Running Time</p>
          </div>
          <div className="year">
            <p>Year</p>
          </div>
        </div>
        {projects.map((project, index) => (
          <div
            className={`t-row ${
              hoveredIndex !== null && index !== hoveredIndex
                ? "not-hovered"
                : ""
            }`}
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="index">
              <p>0{index + 1}</p>
            </div>
            <div className="title">
              <p>{project.title}</p>
            </div>
            <div className="category">
              <p>{project.category}</p>
            </div>
            <div className="time">
              <p
                dangerouslySetInnerHTML={{ __html: project["running time"] }}
              ></p>
            </div>
            <div className="year">
              <p>{project.year}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <Footer />
      </div>
    </div>
  );
};

export default Overview;
