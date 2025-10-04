"use client";
import React from "react";

const Card = React.forwardRef(({ id, phase, date, title, span }, ref) => (
  <div className="card" id={`card-${id}`} ref={ref}>
    <div className="card-phase">
      <p>Phase #{phase}</p>
    </div>
    <div className="card-title">
      <p>From {date}</p>
      <h1>
        {title} <span>{span}</span>
      </h1>
    </div>
  </div>
));

Card.displayName = "Card";

export default Card;
