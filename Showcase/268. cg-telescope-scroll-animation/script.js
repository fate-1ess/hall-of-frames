import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// NOTE: These values are interconnected - when speed changes, it affects when images finish their movement, which also affects the gap between images. When you change the number of items in spotlightItems array, you'll need to adjust these config settings together. Test different combinations until you find the right balance that looks good.
const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

const assetPrefix = import.meta.env.BASE_URL;
const withBase = (path) => `${assetPrefix}${path.replace(/^\/+/, "")}`;

const spotlightItems = [
  { name: "Silent Arc", img: withBase("img_1.jpg") },
  { name: "Bloom24", img: withBase("img_2.jpg") },
  { name: "Glass Fade", img: withBase("img_3.jpg") },
  { name: "Echo 9", img: withBase("img_4.jpg") },
  { name: "Velvet Loop", img: withBase("img_5.jpg") },
  { name: "Field Two", img: withBase("img_6.jpg") },
  { name: "Pale Thread", img: withBase("img_7.jpg") },
  { name: "Stillroom", img: withBase("img_8.jpg") },
  { name: "Ghostline", img: withBase("img_9.jpg") },
  { name: "Mono 73", img: withBase("img_10.jpg") },
];

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

const titlesContainer = document.querySelector(".spotlight-titles");
const imagesContainer = document.querySelector(".spotlight-images");
const spotlightHeader = document.querySelector(".spotlight-header");
const titlesContainerElement = document.querySelector(
  ".spotlight-titles-container"
);
const introTextElements = document.querySelectorAll(".spotlight-intro-text");
const imageElements = [];

spotlightItems.forEach((item, index) => {
  const titleElement = document.createElement("h1");
  titleElement.textContent = item.name;
  if (index === 0) titleElement.style.opacity = "1";
  titlesContainer.appendChild(titleElement);

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "spotlight-img";
  const imgElement = document.createElement("img");
  imgElement.src = item.img;
  imgElement.alt = "";
  imgWrapper.appendChild(imgElement);
  imagesContainer.appendChild(imgWrapper);
  imageElements.push(imgWrapper);
});

const titleElements = titlesContainer.querySelectorAll("h1");
let currentActiveIndex = 0;

const containerWidth = window.innerWidth * 0.3;
const containerHeight = window.innerHeight;
const arcStartX = containerWidth - 220;
const arcStartY = -200;
const arcEndY = containerHeight + 200;
const arcControlPointX = arcStartX + config.arcRadius;
const arcControlPointY = containerHeight / 2;

function getBezierPosition(t) {
  const x =
    (1 - t) * (1 - t) * arcStartX +
    2 * (1 - t) * t * arcControlPointX +
    t * t * arcStartX;
  const y =
    (1 - t) * (1 - t) * arcStartY +
    2 * (1 - t) * t * arcControlPointY +
    t * t * arcEndY;
  return { x, y };
}

function getImgProgressState(index, overallProgress) {
  const startTime = index * config.gap;
  const endTime = startTime + config.speed;

  if (overallProgress < startTime) return -1;
  if (overallProgress > endTime) return 2;

  return (overallProgress - startTime) / config.speed;
}

imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

ScrollTrigger.create({
  trigger: ".spotlight",
  start: "top top",
  end: `+=${window.innerHeight * 10}px`,
  pin: true,
  pinSpacing: true,
  scrub: 1,
  onUpdate: (self) => {
    const progress = self.progress;

    if (progress <= 0.2) {
      const animationProgress = progress / 0.2;

      const moveDistance = window.innerWidth * 0.6;
      gsap.set(introTextElements[0], {
        x: -animationProgress * moveDistance,
      });
      gsap.set(introTextElements[1], {
        x: animationProgress * moveDistance,
      });
      gsap.set(introTextElements[0], { opacity: 1 });
      gsap.set(introTextElements[1], { opacity: 1 });

      gsap.set(".spotlight-bg-img", {
        transform: `scale(${animationProgress})`,
      });
      gsap.set(".spotlight-bg-img img", {
        transform: `scale(${1.5 - animationProgress * 0.5})`,
      });

      imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
      spotlightHeader.style.opacity = "0";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "0",
        "--after-opacity": "0",
      });
    } else if (progress > 0.2 && progress <= 0.25) {
      gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
      gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

      gsap.set(introTextElements[0], { opacity: 0 });
      gsap.set(introTextElements[1], { opacity: 0 });

      imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
      spotlightHeader.style.opacity = "1";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "1",
        "--after-opacity": "1",
      });
    } else if (progress > 0.25 && progress <= 0.95) {
      gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
      gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

      gsap.set(introTextElements[0], { opacity: 0 });
      gsap.set(introTextElements[1], { opacity: 0 });

      spotlightHeader.style.opacity = "1";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "1",
        "--after-opacity": "1",
      });

      const switchProgress = (progress - 0.25) / 0.7;
      const viewportHeight = window.innerHeight;
      const titlesContainerHeight = titlesContainer.scrollHeight;
      const startPosition = viewportHeight;
      const targetPosition = -titlesContainerHeight;
      const totalDistance = startPosition - targetPosition;
      const currentY = startPosition - switchProgress * totalDistance;

      gsap.set(".spotlight-titles", {
        transform: `translateY(${currentY}px)`,
      });

      imageElements.forEach((img, index) => {
        const imageProgress = getImgProgressState(index, switchProgress);

        if (imageProgress < 0 || imageProgress > 1) {
          gsap.set(img, { opacity: 0 });
        } else {
          const pos = getBezierPosition(imageProgress);
          gsap.set(img, {
            x: pos.x - 100,
            y: pos.y - 75,
            opacity: 1,
          });
        }
      });

      const viewportMiddle = viewportHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      titleElements.forEach((title, index) => {
        const titleRect = title.getBoundingClientRect();
        const titleCenter = titleRect.top + titleRect.height / 2;
        const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);

        if (distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestIndex = index;
        }
      });

      if (closestIndex !== currentActiveIndex) {
        if (titleElements[currentActiveIndex]) {
          titleElements[currentActiveIndex].style.opacity = "0.25";
        }
        titleElements[closestIndex].style.opacity = "1";
        document.querySelector(".spotlight-bg-img img").src =
          spotlightItems[closestIndex].img;
        currentActiveIndex = closestIndex;
      }
    } else if (progress > 0.95) {
      spotlightHeader.style.opacity = "0";
      gsap.set(titlesContainerElement, {
        "--before-opacity": "0",
        "--after-opacity": "0",
      });
    }
  },
});
