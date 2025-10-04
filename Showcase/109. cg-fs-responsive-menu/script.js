document.addEventListener("DOMContentLoaded", function () {
  const menu = document.querySelector(".menu");
  const toggleButton = document.querySelector(".toggle");
  const closeButton = document.querySelector(".close-btn");
  let isOpen = false;

  const timeline = gsap.timeline({ paused: true });

  timeline.to(menu, {
    duration: 0.3,
    opacity: 1,
  });

  timeline.to(
    menu,
    {
      duration: 1,
      ease: "power3.inOut",
      clipPath: "polygon(49.75% 0%, 50.25% 0%, 50.25% 100%, 49.75% 100%)",
    },
    "-=0.3"
  );

  timeline.to(menu, {
    duration: 1,
    ease: "power3.inOut",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    pointerEvents: "all",
  });

  timeline.to(
    ".divider",
    {
      duration: 1,
      ease: "power4.inOut",
      height: "100%",
    },
    "-=0.75"
  );

  toggleButton.addEventListener("click", function () {
    if (isOpen) {
      timeline.reverse();
    } else {
      timeline.play();
    }
    isOpen = !isOpen;
  });

  closeButton.addEventListener("click", function () {
    if (isOpen) {
      timeline.reverse();
    } else {
      timeline.play();
    }
    isOpen = !isOpen;
  });
});
