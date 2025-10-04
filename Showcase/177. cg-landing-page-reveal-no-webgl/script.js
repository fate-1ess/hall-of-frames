document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase);
  CustomEase.create(
    "hop",
    "M0,0 C0.053,0.604 0.157,0.72 0.293,0.837 0.435,0.959 0.633,1 1,1"
  );

  const itemsCount = 30;
  const container = document.querySelector(".container");
  const gallery = document.querySelector(".gallery");
  let isCircularLayout = false;

  const createItems = () => {
    for (let i = 1; i <= itemsCount; i++) {
      const item = document.createElement("div");
      item.classList.add("item");

      const img = document.createElement("img");
      img.src = `./assets/img${i}.jpg`;
      img.alt = `Image ${i}`;

      item.appendChild(img);
      gallery.appendChild(item);
    }
  };

  const setInitialLinearLayout = () => {
    const items = document.querySelectorAll(".item");
    const totalItemsWidth = (items.length - 1) * 10 + items[0].offsetWidth;
    const startX = (container.offsetWidth - totalItemsWidth) / 2;

    items.forEach((item, index) => {
      gsap.set(item, {
        left: `${startX + index * 10}px`,
        top: "150%",
        rotation: 0,
      });
    });

    gsap.to(items, {
      top: "50%",
      transform: "translateY(-50%)",
      duration: 1,
      ease: "hop",
      stagger: 0.03,
    });
  };

  gsap.to(".loader p", {
    y: 0,
    duration: 1,
    ease: "power3.out",
    delay: 1,
    onComplete: animateCounter,
  });

  function animateCounter() {
    const counterElement = document.querySelector(".loader p");
    let currentValue = 0;
    const updateInterval = 300;
    const maxDuration = 2000;
    const endValue = 100;
    const startTime = Date.now();

    const updateCounter = () => {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < maxDuration) {
        currentValue = Math.min(
          currentValue + Math.floor(Math.random() * 30) + 5,
          endValue
        );
        counterElement.textContent = currentValue;
        setTimeout(updateCounter, updateInterval);
      } else {
        counterElement.textContent = endValue;
        setTimeout(() => {
          gsap.to(counterElement, {
            y: -20,
            duration: 1,
            ease: "power3.inOut",
            onComplete: () => {
              animateToCircularLayout();
              setTimeout(() => {
                gsap.to(".nav-item p", {
                  y: 0,
                  duration: 1,
                  ease: "power3.inOut",
                  stagger: 0.075,
                });
              }, 100);
            },
          });
        }, -300);
      }
    };

    updateCounter();
  }

  const setCircularLayout = () => {
    const items = document.querySelectorAll(".item");
    const numberOfItems = items.length;
    const angleIncrement = (2 * Math.PI) / numberOfItems;
    const radius = 210;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;

    items.forEach((item, index) => {
      const angle = index * angleIncrement;
      const x = centerX + radius * Math.cos(angle) - item.offsetWidth / 2;
      const y = centerY + radius * Math.sin(angle) - item.offsetHeight / 2;

      gsap.set(item, {
        left: `${x}px`,
        top: `${y}px`,
        rotation: (angle * 180) / Math.PI - 90,
        transform: "translateY(0%)",
      });
    });
  };

  const animateToCircularLayout = () => {
    const items = document.querySelectorAll(".item");
    const state = Flip.getState(items);

    setCircularLayout();

    Flip.from(state, {
      duration: 2,
      ease: "hop",
      stagger: -0.03,
      onEnter: (element) => gsap.to(element, { rotation: "+=360" }),
    });

    isCircularLayout = !isCircularLayout;
  };

  const initgallery = () => {
    createItems();
    setInitialLinearLayout();
  };

  initgallery();
});
