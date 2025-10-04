import React from "react";

const ProgressBar = React.forwardRef(({ progressRef }, ref) => (
  <div className="progress-bar" ref={ref}>
    <div className="progress" ref={progressRef}></div>
  </div>
));

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
