document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);
  CustomEase.create(
    "hop",
    "M0,0 C0.053,0.604 0.157,0.72 0.293,0.837 0.435,0.959 0.633,1 1,1"
  );

  const filterMap = {
    featured: [1, 3, 7, 16, 19, 25, 33, 39, 42, 45, 50],
    branding: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    marketing: [2, 3, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    website: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
    content: [1, 2, 4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
    ecommerce: [3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
  };

  const items = document.querySelector(".items");
  const buttons = document.querySelectorAll(".filters button");
  let itemsWidth = items.scrollWidth;
  let containerWidth = document.body.offsetWidth;

  let currentX = 0;
  let targetX = 0;
  const lerpFactor = 0.025;

  const getRandomHeight = () => {
    return Math.floor(Math.random() * (225 - 150 + 1)) + 150 + "px";
  };

  const createItems = () => {
    items.innerHTML = "";
    for (let i = 1; i <= 50; i++) {
      const item = document.createElement("div");
      item.classList.add("item");
      item.style.height = getRandomHeight();

      for (const [className, indices] of Object.entries(filterMap)) {
        if (indices.includes(i)) {
          item.classList.add(className);
        }
      }

      const img = document.createElement("img");
      img.src = `./assets/img${i}.jpg`;
      img.alt = `Image ${i}`;

      item.appendChild(img);
      items.appendChild(item);
    }

    updateItemsWidth();
    resetPosition();
    applyMouseMoveEffect();
  };

  const updateItemsWidth = () => {
    itemsWidth = items.scrollWidth;
  };

  const resetPosition = () => {
    gsap.to(items, { x: 0, ease: "power2.out", duration: 0.5 });
    currentX = 0;
    targetX = 0;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      filterItems(filter);
    });
  });

  const filterItems = (filter) => {
    const allItems = document.querySelectorAll(".item");

    allItems.forEach((item) => {
      const isCurrentlyHidden = getComputedStyle(item).display === "none";

      if (item.classList.contains(filter)) {
        if (isCurrentlyHidden) {
          gsap.set(item, { display: "flex", width: "25px" });
          gsap.to(item, {
            width: "250px",
            ease: "hop",
            duration: 1,
            onComplete: updateItemsWidth,
          });
        }
      } else {
        gsap.set(item, { display: "none", width: "0px" });
      }
    });

    resetPosition();
    setTimeout(() => {
      updateItemsWidth();
      applyMouseMoveEffect();
    }, 1000);
  };

  const applyMouseMoveEffect = () => {
    items.removeEventListener("mousemove", handleMouseMove);

    if (itemsWidth > containerWidth) {
      items.addEventListener("mousemove", handleMouseMove);
    }
  };

  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const maxScroll = itemsWidth - containerWidth;
    const percentage = mouseX / containerWidth;
    targetX = -maxScroll * percentage;
  };

  const animate = () => {
    currentX += (targetX - currentX) * lerpFactor;
    gsap.set(items, { x: currentX });

    requestAnimationFrame(animate);
  };

  animate();

  createItems();
  filterItems("featured");
});
