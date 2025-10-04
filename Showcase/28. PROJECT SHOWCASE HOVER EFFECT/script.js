const { gsap } = window;

gsap
  .timeline()
  .set(".menu", { autoAlpha: 1 })
  .from(".menu__item-innertext", {
    delay: 1,
    duration: 0.85,
    stagger: 0.095,
    skewY: gsap.utils.wrap([-8, 8]),
    ease: "expo.out",
  })
  .set(".menu", { pointerEvents: "all" });

gsap.defaults({
  duration: 0.55,
  ease: "expo.out",
});

const menuItems = document.querySelectorAll(".menu__item");

menuItems.forEach((item) => {
  const imageWrapper = item.querySelector(".menu__item-image_wrapper");
  const imageWrapperBounds = imageWrapper.getBoundingClientRect();
  let itemBounds = item.getBoundingClientRect();

  const onMouseEnter = () => {
    gsap.set(imageWrapper, {
      scale: 0.8,
    });
    gsap.to(imageWrapper, { opacity: 1, scale: 1 });
  };

  const onMouseLeave = () => {
    gsap.to(imageWrapper, {
      opacity: 0,
      scale: 0.2,
    });
  };

  const onMouseMove = ({ x, y }) => {
    let yOffset = itemBounds.top / imageWrapperBounds.height;
    yOffset = gsap.utils.mapRange(0, 1.5, -150, 150, yOffset);
    gsap.to(imageWrapper, {
      duration: 1.25,
    });
  };

  item.addEventListener("mouseenter", onMouseEnter);
  item.addEventListener("mouseleave", onMouseLeave);
  item.addEventListener("mousemove", onMouseMove);

  window.addEventListener("resize", () => {
    itemBounds = item.getBoundingClientRect();
  });
});
