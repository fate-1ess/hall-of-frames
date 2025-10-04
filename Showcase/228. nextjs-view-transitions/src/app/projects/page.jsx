"use client";

import ReactLenis from "@studio-freight/react-lenis";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const resolveAsset = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
};

const Projects = () => {
  const images = [
    resolveAsset("/img1.jpeg"),
    resolveAsset("/img2.jpeg"),
    resolveAsset("/img3.jpeg"),
    resolveAsset("/img4.jpeg"),
  ];

  return (
    <ReactLenis root>
      <div className="projects">
        <div className="images">
          {images.map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
      </div>
    </ReactLenis>
  );
};

export default Projects;
