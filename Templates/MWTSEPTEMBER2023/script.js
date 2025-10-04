const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu-link");

let menuOpen = false; // Track the state of the menu

menuToggle.addEventListener("click", toggleMenu);

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

function toggleMenu() {
  if (!menuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
}

function openMenu() {
  gsap.to(menuToggle, {
    rotation: 45,
    duration: 0.5,
  });

  gsap.to(menuToggle.querySelector("span"), {
    color: "white",
    duration: 0.5,
  });

  gsap.to(menu, {
    opacity: 1,
    pointerEvents: "all",
    duration: 0.5,
  });
  menuOpen = true;
}

function closeMenu() {
  gsap.to(menuToggle.querySelector("span"), {
    color: "black",
    duration: 0.5,
  });

  gsap.to(menuToggle, {
    rotation: 0,
    duration: 0.5,
  });

  gsap.to(menu, {
    opacity: 0,
    pointerEvents: "none",
    duration: 0.5,
  });
  menuOpen = false;
}
