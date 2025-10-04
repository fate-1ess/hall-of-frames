document.addEventListener("DOMContentLoaded", () => {
  const windowWidth = window.innerWidth;
  const wrapperWidth = 180;
  const finalPosition = windowWidth - wrapperWidth;
  const stepDistance = finalPosition / 6;
  const tl = gsap.timeline();

  tl.to(".count", {
    x: -900,
    duration: 0.85,
    delay: 0.5,
    ease: "power4.inOut",
  });

  for (let i = 1; i <= 6; i++) {
    const xPosition = -900 + i * 180;
    tl.to(".count", {
      x: xPosition,
      duration: 0.85,
      ease: "power4.inOut",
      onStart: () => {
        gsap.to(".count-wrapper", {
          x: stepDistance * i,
          duration: 0.85,
          ease: "power4.inOut",
        });
      },
    });
  }

  gsap.set(".revealer svg", { scale: 0 });

  const delays = [6, 6.5, 7];
  document.querySelectorAll(".revealer svg").forEach((el, i) => {
    gsap.to(el, {
      scale: 45,
      duration: 1.5,
      ease: "power4.inOut",
      delay: delays[i],
      onComplete: () => {
        if (i === delays.length - 1) {
          document.querySelector(".loader").remove();
        }
      },
    });
  });

  gsap.to(".header h1", {
    onStart: () => {
      gsap.to(".toggle-btn", {
        scale: 1,
        duration: 1,
        ease: "power4.inOut",
      });
      gsap.to(".line p", {
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    rotateY: 0,
    opacity: 1,
    duration: 2,
    ease: "power3.out",
    delay: 8,
  });
});
