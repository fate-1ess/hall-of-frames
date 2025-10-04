import gsap from "gsap";
import {
  withBasePath,
  normalizeInternalPath,
  isExternalUrl,
} from "./base-path.js";

// animation functions
function revealTransition() {
  return new Promise((resolve) => {
    gsap.set(".transition-overlay", { scaleY: 1, transformOrigin: "top" });
    gsap.to(".transition-overlay", {
      scaleY: 0,
      duration: 0.6,
      delay: 0.5,
      ease: "power2.inOut",
      onComplete: resolve,
    });
  });
}

function animateTransition() {
  return new Promise((resolve) => {
    gsap.set(".transition-overlay", { scaleY: 0, transformOrigin: "bottom" });
    gsap.to(".transition-overlay", {
      scaleY: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: resolve,
    });
  });
}

// utility functions
function closeMenuIfOpen() {
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  if (menuToggleBtn && menuToggleBtn.classList.contains("menu-open")) {
    menuToggleBtn.click();
  }
}

function isSamePage(href) {
  const normalizedHref = normalizeInternalPath(href);
  if (!normalizedHref) return true;

  const currentPath = normalizeInternalPath(window.location.pathname);

  if (normalizedHref === currentPath) return true;

  const isIndex = (value) => value === "/" || value === "/index.html";
  if (isIndex(currentPath) && isIndex(normalizedHref)) {
    return true;
  }

  const currentFile = currentPath.split("/").pop() || "index.html";
  const hrefFile = normalizedHref.split("/").pop() || "index.html";

  return currentFile === hrefFile;
}

// main execution
document.addEventListener("DOMContentLoaded", () => {
  const isPageNavigation = sessionStorage.getItem("pageTransition") === "true";

  if (isPageNavigation) {
    sessionStorage.removeItem("pageTransition");
    revealTransition();
  } else {
    gsap.set(".transition-overlay", { scaleY: 0 });
  }

  // handle link clicks
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");

    if (href && isExternalUrl(href)) {
      return;
    }

    // prevent same page navigation
    if (isSamePage(href)) {
      event.preventDefault();
      closeMenuIfOpen();
      return;
    }

    // animate transition to new page
    event.preventDefault();
    sessionStorage.setItem("pageTransition", "true");
    animateTransition().then(() => {
      const target = withBasePath(normalizeInternalPath(href));
      window.location.href = target;
    });
  });
});
