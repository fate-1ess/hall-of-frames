const computePageBase = () => {
  if (typeof window !== "undefined") {
    const { pathname } = window.location;
    const base = pathname.replace(/[^/]*$/, "");
    return base.endsWith("/") ? base : `${base}/`;
  }

  const fallback = import.meta.env.BASE_URL || "/";
  if (fallback === "." || fallback === "./") {
    return "/";
  }
  return fallback.endsWith("/") ? fallback : `${fallback}/`;
};

const pageBase = computePageBase();

const withBase = (relativePath) => {
  const normalized = relativePath.replace(/^\/+/, "");
  if (!normalized) {
    return pageBase;
  }
  return `${pageBase}${normalized}`;
};

const slides = [
  {
    slideTitle: "Brainstorm OS",
    slideDescription:
      "A concept UI for a neural-thinking workspace. Designed to visualize raw ideas, tangled thoughts, and clean execution — all at once.",
    slideUrl: "project.html",
    slideTags: ["Web Design", "UI/UX", "Concept UI", "Creative Dev"],
    slideImg: withBase("work/slider-img-1.jpg"),
  },
  {
    slideTitle: "Orange Room",
    slideDescription:
      "A surreal microsite exploring control, uniformity, and digital disconnect. Built with scroll-reactive animations and bold, brutalist layout.",
    slideUrl: "project.html",
    slideTags: ["Creative Dev", "Scroll UX", "Experimental", "Visual Story"],
    slideImg: withBase("work/slider-img-2.jpg"),
  },
  {
    slideTitle: "Futureschool",
    slideDescription:
      "A quirky concept for a 60s-style AI education platform. Handcrafted visuals meet structured layouts for a playful learning interface.",
    slideUrl: "project.html",
    slideTags: ["UI Design", "Theme Concept", "Playful UX", "Frontend"],
    slideImg: withBase("work/slider-img-3.jpg"),
  },
  {
    slideTitle: "Mindwave Grid",
    slideDescription:
      "A visual identity experiment for a VR-based ideation tool. Dynamic grids, floating modules, and warm tones bring structure to wild thinking.",
    slideUrl: "project.html",
    slideTags: ["VR Design", "Grid System", "Creative Tech", "3D UI"],
    slideImg: withBase("work/slider-img-4.jpg"),
  },
];

export default slides;
