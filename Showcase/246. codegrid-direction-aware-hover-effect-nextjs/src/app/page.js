"use client";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const highlightRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;
    const gridItems = container.querySelectorAll(".grid-item");
    const firstItem = container.querySelector(".grid-item");

    const highlightColors = [
      "#E24E1B",
      "#4381C1",
      "#F79824",
      "#04A777",
      "#5B8C5A",
      "#2176FF",
      "#818D92",
      "#22AAA1",
    ];

    gridItems.forEach((item, index) => {
      item.dataset.color = highlightColors[index % highlightColors.length];
    });

    const moveToElement = (element) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        highlight.style.transform = `translate(${
          rect.left - containerRect.left
        }px, ${rect.top - containerRect.top}px)`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.backgroundColor = element.dataset.color;
      }
    };

    const moveHighlight = (e) => {
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);

      if (hoveredElement && hoveredElement.classList.contains("grid-item")) {
        moveToElement(hoveredElement);
      } else if (
        hoveredElement &&
        hoveredElement.parentElement &&
        hoveredElement.parentElement.classList.contains("grid-item")
      ) {
        moveToElement(hoveredElement.parentElement);
      }
    };

    moveToElement(firstItem);

    container.addEventListener("mousemove", moveHighlight);

    return () => {
      container.removeEventListener("mousemove", moveHighlight);
    };
  }, []);

  return (
    <>
      <nav>
        <p>Codegrid</p>
        <p>/ Experiment 448</p>
      </nav>
      <div className="container" ref={containerRef}>
        <div className="grid">
          <div className="grid-row">
            <div className="grid-item">
              <p>( html )</p>
            </div>
            <div className="grid-item">
              <p>( css )</p>
            </div>
            <div className="grid-item">
              <p>( javascript )</p>
            </div>
          </div>
          <div className="grid-row">
            <div className="grid-item">
              <p>( gsap )</p>
            </div>
            <div className="grid-item">
              <p>( scrolltrigger )</p>
            </div>
            <div className="grid-item">
              <p>( react )</p>
            </div>
            <div className="grid-item">
              <p>( next.js )</p>
            </div>
            <div className="grid-item">
              <p>( three.js )</p>
            </div>
          </div>
        </div>
        <div className="highlight" ref={highlightRef}></div>
      </div>
      <footer>
        <p>Unlock Source Code with PRO</p>
        <p>Link in description</p>
      </footer>
    </>
  );
}
