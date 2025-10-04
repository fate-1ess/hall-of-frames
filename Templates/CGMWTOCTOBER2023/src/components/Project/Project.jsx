import React from "react";
import { Link } from "react-router-dom";
import { resolveAssetPath } from "../../utils/assetPaths";

const Project = ({ projectImg, projectTitle, projectCategory }) => {
  const resolvedImg = resolveAssetPath(projectImg);
  return (
    <div className="project">
      <Link to="/work/sample-project">
        <div className="project-img">
          <img src={resolvedImg} alt="" />
        </div>
        <div className="project-title">
          <p>{projectTitle}</p>
        </div>
        <div className="project-category">
          <p>{projectCategory}</p>
        </div>
      </Link>
    </div>
  );
};

export default Project;
