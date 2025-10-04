import { carouselItems, services, archive } from "../content/data.js";

document.addEventListener("DOMContentLoaded", () => {
  let lenisInstance;
  let scrollInitialized = false;

  const ensureLenis = () => {
    if (lenisInstance) return lenisInstance;
    lenisInstance = new Lenis();
    lenisInstance.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    return lenisInstance;
  };

  // time and date
  updateDateTime();
  setInterval(updateDateTime, 1000);

  function updateDateTime() {
    const now = new Date();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeZoneAbbr = timeZone.split("/").pop().replace("_", " ");

    const timeOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const timeStr =
      now.toLocaleTimeString("en-US", timeOptions) + ` [${timeZoneAbbr}]`;
    document.getElementById("current-time").textContent = timeStr;

    const dateOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    const dateStr = now.toLocaleDateString("en-US", dateOptions);
    document.getElementById("current-date").textContent = dateStr;
  }

  // create services
  const serviceswrapper = document.querySelector(".services .wrapper");
  serviceswrapper.innerHTML = "";

  services.forEach((service) => {
    const serviceElement = document.createElement("div");
    serviceElement.className = "service";

    serviceElement.innerHTML = `
      <div class="index">
        <p>[${service.id}]</p>
      </div>
      <div class="title">
        <h3>${service.title}</h3>
      </div>
      <div class="copy">
        <p>${service.copy}</p>
      </div>
    `;

    serviceswrapper.appendChild(serviceElement);
  });

  // create carousel
  const carouselwrapper = document.querySelector(".carousel");

  carouselItems.forEach((item) => {
    const projectElement = document.createElement("div");
    projectElement.className = "project";
    projectElement.id = `project-${item.id}`;

    projectElement.innerHTML = `
          <a href="${item.url}">
            <div class="project-bg">
                <img src="${item.bg}" alt="" />
            </div>
            <div class="project-main">
                <img src="${item.main}" alt="" />
            </div>
            <div class="project-header">
                <p>Project ${item.id}</p>
                <h2>${item.title}</h2>
            </div>
            <div class="project-info">
                <div class="project-tags">
                ${item.tags[0]
                  .split(", ")
                  .map((tag) => `<p>${tag}</p>`)
                  .join("")}
                </div>
                <div class="project-url">
                <a href="${item.url}">View Project</a>
                </div>
            </div>
         </a>
        `;

    carouselwrapper.appendChild(projectElement);
  });

  // create archive
  const archivewrapper = document.querySelector(".archive .wrapper");
  archivewrapper.innerHTML = "";

  archive.forEach((item) => {
    const archiveElement = document.createElement("div");
    archiveElement.className = "archive-item";

    const imagesHTML = item.images
      .map(
        (image) =>
          `<div class="img">
          <img src="./assets/archive/${image.trim()}.jpg" alt="" />
         </div>`
      )
      .join("");

    archiveElement.innerHTML = `
      <div class="archive-col archive-shots">
        ${imagesHTML}
      </div>
      <div class="archive-col archive-info">
        <div class="archive-title">
          <h3>${item.name}</h3>
        </div>
        <div class="archive-year">
          <p>${item.year}</p>
        </div>
      </div>
    `;

    archivewrapper.appendChild(archiveElement);
  });

  const initializeScrollAnimations = () => {
    if (scrollInitialized) return;
    scrollInitialized = true;

    const lenis = ensureLenis();
    gsap.registerPlugin(ScrollTrigger);

    const heroSectionPinnedHeight = window.innerHeight * 3;
    const finishAboutHeaderClipReveal = window.innerHeight;
    const portraitsSectionPinnedHeight = window.innerHeight * 1;
    const carouselSectionPinnedHeight = window.innerHeight * 5;

    // make first slide in carousel visible on page load
    gsap.set("#project-01", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
    });

    // handle nav + site info color changes
    const nav = document.querySelector("nav");
    const siteIntro = document.querySelector(".site-intro");

    ScrollTrigger.create({
      trigger: ".hero",
      start: "-1% top",
      end: `+=${window.innerHeight}`,
      onEnter: () => {
        nav.classList.add("dark");
        nav.classList.remove("light");
        siteIntro.classList.add("dark");
        siteIntro.classList.remove("light");
      },
      onLeave: () => {
        nav.classList.remove("dark");
        nav.classList.add("light");
        siteIntro.classList.remove("dark");
        siteIntro.classList.add("light");
      },
      onEnterBack: () => {
        nav.classList.add("dark");
        nav.classList.remove("light");
        siteIntro.classList.add("dark");
        siteIntro.classList.remove("light");
      },
      onLeaveBack: () => {
        nav.classList.remove("dark");
        nav.classList.add("light");
        siteIntro.classList.remove("dark");
        siteIntro.classList.add("light");
      },
    });

  ScrollTrigger.create({
    trigger: ".carousel",
    start: `top+=${window.innerHeight * 7}px top`,
    onEnter: () => {
      nav.classList.remove("light");
      nav.classList.add("dark");
      siteIntro.classList.remove("light");
      siteIntro.classList.add("dark");
    },
    onLeaveBack: () => {
      nav.classList.add("light");
      nav.classList.remove("dark");
      siteIntro.classList.add("light");
      siteIntro.classList.remove("dark");
    },
  });

  // nav-item scroll progress animations
  const infoProgress = document.querySelector(
    ".nav-item:first-child .progress"
  );
  const workProgress = document.querySelector(
    ".nav-item:nth-child(2) .progress"
  );
  const archiveProgress = document.querySelector(
    ".nav-item:nth-child(3) .progress"
  );
  const contactProgress = document.querySelector(
    ".nav-item:nth-child(4) .progress"
  );

  gsap.set([infoProgress, workProgress, archiveProgress, contactProgress], {
    scaleX: 0,
    transformOrigin: "left",
  });

  ScrollTrigger.create({
    trigger: ".portraits",
    start: "top 100%",
    endTrigger: ".carousel",
    end: "top -100%",
    onUpdate: (self) => {
      if (self.direction > 0) {
        if (self.progress === 1) {
          gsap.set(infoProgress, { transformOrigin: "right" });
          gsap.to(infoProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(infoProgress, { transformOrigin: "left" });
          gsap.to(infoProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      } else if (self.direction < 0) {
        if (self.progress === 0) {
          gsap.set(infoProgress, { transformOrigin: "left" });
          gsap.to(infoProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(infoProgress, { transformOrigin: "left" });
          gsap.to(infoProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".carousel",
    start: "top -100%",
    end: `+=${window.innerHeight * 5}`,
    scrub: true,
    onUpdate: (self) => {
      if (self.direction > 0) {
        if (self.progress === 1) {
          gsap.set(workProgress, { transformOrigin: "right" });
          gsap.to(workProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(workProgress, { transformOrigin: "left" });
          gsap.to(workProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      } else if (self.direction < 0) {
        if (self.progress === 0) {
          gsap.set(workProgress, { transformOrigin: "left" });
          gsap.to(workProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(workProgress, { transformOrigin: "left" });
          gsap.to(workProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".carousel",
    start: `top+=${window.innerHeight * 6}px top`,
    end: () =>
      `+=${
        document.querySelector(".footer").getBoundingClientRect().top -
        document.querySelector(".archive").getBoundingClientRect().top
      }`,
    scrub: true,
    onUpdate: (self) => {
      if (self.direction > 0) {
        if (self.progress === 1) {
          gsap.set(archiveProgress, { transformOrigin: "right" });
          gsap.to(archiveProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(archiveProgress, { transformOrigin: "left" });
          gsap.to(archiveProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      } else if (self.direction < 0) {
        if (self.progress === 0) {
          gsap.set(archiveProgress, { transformOrigin: "left" });
          gsap.to(archiveProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(archiveProgress, { transformOrigin: "left" });
          gsap.to(archiveProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      }
    },
  });

  ScrollTrigger.create({
    trigger: ".archive",
    start: `top+=${window.innerHeight * 7}px top`,
    end: `+=${window.innerHeight * 2}`,
    scrub: true,
    onUpdate: (self) => {
      if (self.direction > 0) {
        if (self.progress === 1) {
          gsap.set(contactProgress, { transformOrigin: "right" });
          gsap.to(contactProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(contactProgress, { transformOrigin: "left" });
          gsap.to(contactProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      } else if (self.direction < 0) {
        if (self.progress === 0) {
          gsap.set(contactProgress, { transformOrigin: "left" });
          gsap.to(contactProgress, {
            scaleX: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        } else {
          gsap.set(contactProgress, { transformOrigin: "left" });
          gsap.to(contactProgress, {
            scaleX: self.progress,
            duration: 0,
          });
        }
      }
    },
  });

  // reveal about section inside hero
  ScrollTrigger.create({
    trigger: ".hero",
    start: "1% top",
    end: `+=${finishAboutHeaderClipReveal}`,
    scrub: 1,
    onUpdate: (self) => {
      const startTop = gsap.utils.interpolate(50, 0, self.progress);
      const endBottom = gsap.utils.interpolate(50, 100, self.progress);

      const clipPath = `polygon(0% ${startTop}%, 100% ${startTop}%, 100% ${endBottom}%, 0% ${endBottom}%)`;
      gsap.set(".about-header", {
        clipPath: clipPath,
      });
    },
  });

  // about header fades in
  ScrollTrigger.create({
    trigger: ".hero",
    start: "25% top",
    end: `+=${finishAboutHeaderClipReveal}`,
    scrub: 1,
    onUpdate: (self) => {
      const scale = gsap.utils.interpolate(0.75, 1, self.progress);
      const opacity = gsap.utils.interpolate(0, 1, self.progress);

      gsap.set(".about-header h1", {
        scale: scale,
        opacity: opacity,
      });
    },
  });

  // about header fades out partially
  ScrollTrigger.create({
    trigger: ".portraits",
    start: "bottom top",
    end: `+=${finishAboutHeaderClipReveal}`,
    scrub: 1,
    onUpdate: (self) => {
      const opacity = gsap.utils.interpolate(1, 0.25, self.progress);

      gsap.set(".about-header h1", {
        opacity: opacity,
      });
    },
  });

  // animate carousel slides
  carouselItems.slice(1).forEach((item, index) => {
    ScrollTrigger.create({
      trigger: ".carousel",
      start: `top+=${(index + 1) * window.innerHeight}px top`,
      end: `top+=${(index + 2) * window.innerHeight}px top`,
      scrub: 1,
      onUpdate: (self) => {
        const clipPath = gsap.utils.interpolate(
          "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          self.progress
        );

        gsap.set(`#project-${item.id}`, {
          clipPath: clipPath,
        });
      },
    });
  });

  // pin sections
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: `+=${heroSectionPinnedHeight}`,
    pin: true,
    pinSpacing: false,
  });

  ScrollTrigger.create({
    trigger: ".portraits",
    start: "top bottom",
    end: `+=${portraitsSectionPinnedHeight}`,
    pin: true,
    pinSpacing: true,
  });

  ScrollTrigger.create({
    trigger: ".carousel",
    start: "top top",
    end: `+=${carouselSectionPinnedHeight}`,
    pin: true,
    pinSpacing: true,
  });

  // portraits (parallax animation)
  ScrollTrigger.create({
    trigger: ".portraits",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => {
      const topPosition = gsap.utils.interpolate(40, 30, self.progress);

      gsap.set(".portrait.p-1", {
        yPercent: `${topPosition}`,
      });
    },
  });

  ScrollTrigger.create({
    trigger: ".portraits",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => {
      const topPosition = gsap.utils.interpolate(25, -75, self.progress);

      gsap.set(".portrait.p-2", {
        yPercent: `${topPosition}`,
      });
    },
  });

  ScrollTrigger.create({
    trigger: ".portraits",
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    onUpdate: (self) => {
      const topPosition = gsap.utils.interpolate(100, 0, self.progress);

      gsap.set(".portrait.p-3", {
        yPercent: `${topPosition}`,
      });
    },
  });

  // services section copy reveal animation
  services.forEach((service, index) => {
    const serviceElement = document.querySelector(
      `.service:nth-child(${index + 1})`
    );
    new SplitType(serviceElement.querySelector(".copy p"), {
      types: "lines",
      lineClass: "line",
    });
    new SplitType(serviceElement.querySelector(".title h3"), {
      types: "chars",
      charClass: "char",
    });
  });

  gsap.set(".line", {
    position: "relative",
    opacity: 0,
    y: 20,
    willChange: "transform, opacity",
  });

  gsap.set(".char", {
    position: "relative",
    opacity: 0,
    willChange: "opacity",
  });

  services.forEach((service, index) => {
    const serviceElement = document.querySelector(
      `.service:nth-child(${index + 1})`
    );
    const index_el = serviceElement.querySelector(".index");
    const chars = serviceElement.querySelectorAll(".char");
    const lines = serviceElement.querySelectorAll(".line");

    ScrollTrigger.create({
      trigger: serviceElement,
      start: "top 100%",
      end: "bottom top",
      scrub: false,
      onEnter: () => {
        gsap.to(index_el, { opacity: 1, duration: 0.5 });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.05,
          stagger: { amount: 0.3 },
          delay: 0.1,
        });
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: { amount: 0.15 },
          delay: 0.2,
        });
      },
      onEnterBack: () => {
        gsap.to(index_el, { opacity: 1, duration: 0.5 });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.05,
          stagger: { amount: 0.3 },
          delay: 0.1,
        });
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: { amount: 0.15 },
          delay: 0.2,
        });
      },
      onLeaveBack: (self) => {
        if (self.direction < 0) {
          gsap.to(index_el, { opacity: 0, duration: 0.3 });
          gsap.to(chars, {
            opacity: 0,
            duration: 0.25,
          });
          gsap.to(lines, {
            opacity: 0,
            y: 20,
            duration: 0.25,
          });
        }
      },
    });
  });

  // archive section copy reveal animation
  archive.forEach((_, index) => {
    const archiveElement = document.querySelector(
      `.archive-item:nth-child(${index + 1})`
    );
    new SplitType(archiveElement.querySelector(".archive-title h3"), {
      types: "chars",
      charClass: "char",
    });
  });

  gsap.set(".archive-shots .img", {
    position: "relative",
    opacity: 0,
    y: 40,
    willChange: "transform, opacity",
  });

  gsap.set(".archive-title .char", {
    position: "relative",
    opacity: 0,
    willChange: "opacity",
  });

  gsap.set(".archive-year p", {
    opacity: 0,
    willChange: "opacity",
  });

  archive.forEach((_, index) => {
    const archiveElement = document.querySelector(
      `.archive-item:nth-child(${index + 1})`
    );
    const images = archiveElement.querySelectorAll(".archive-shots .img");
    const chars = archiveElement.querySelectorAll(".archive-title .char");
    const year = archiveElement.querySelector(".archive-year p");

    ScrollTrigger.create({
      trigger: archiveElement,
      start: "top 100%",
      end: "bottom top",
      scrub: false,
      onEnter: () => {
        gsap.to(images, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: { amount: 0.1 },
        });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.05,
          stagger: { amount: 0.3 },
          delay: 0.1,
        });
        gsap.to(year, {
          opacity: 1,
          duration: 0.5,
          delay: 0.2,
        });
      },
      onEnterBack: () => {
        gsap.to(images, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: { amount: 0.1 },
        });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.05,
          stagger: { amount: 0.3 },
          delay: 0.1,
        });
        gsap.to(year, {
          opacity: 1,
          duration: 0.5,
          delay: 0.2,
        });
      },
      onLeaveBack: (self) => {
        if (self.direction < 0) {
          gsap.to(images, {
            opacity: 0,
            y: 40,
            duration: 0.25,
          });
          gsap.to(chars, {
            opacity: 0,
            duration: 0.25,
          });
          gsap.to(year, {
            opacity: 0,
            duration: 0.25,
          });
        }
      },
    });
  });

  // footer section header reveal animation
  new SplitType(".footer .outro h1", {
    types: "chars",
    charClass: "char",
  });

  gsap.set(".footer .outro .char", {
    position: "relative",
    y: 500,
    willChange: "transform",
  });

  ScrollTrigger.create({
    trigger: ".footer",
    start: "top 75%",
    end: "bottom bottom",
    scrub: false,
    onEnter: () => {
      gsap.to(".footer .outro .char", {
        y: 0,
        duration: 0.75,
        stagger: { amount: 0.3 },
        ease: "power2.out",
      });
    },
    onEnterBack: () => {
      gsap.to(".footer .outro .char", {
        y: 0,
        duration: 0.75,
        stagger: { amount: 0.3 },
        ease: "power2.out",
      });
    },
    onLeaveBack: () => {
      gsap.to(".footer .outro .char", {
        y: 500,
        duration: 0.25,
        ease: "power2.in",
      });
    },
  });

  // navigation click handling
    document.querySelectorAll(".nav-item").forEach((navItem) => {
      navItem.addEventListener("click", (e) => {
        e.preventDefault();

        const sectionId = navItem.id;
        let scrollTarget = 0;

        switch (sectionId) {
          case "hero":
            scrollTarget = 0;
            break;
          case "carousel":
            scrollTarget = window.innerHeight * 4;
            break;
          case "archive":
            scrollTarget = window.innerHeight * 10;
            break;
          case "footer":
            scrollTarget = window.innerHeight * 12;
            break;
        }

        lenis.scrollTo(scrollTarget, {
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      });
    });

    ScrollTrigger.refresh();
  };

  if (document.readyState === "complete") {
    initializeScrollAnimations();
  } else {
    window.addEventListener("load", initializeScrollAnimations, { once: true });
  }
});
console.log("Script loaded");

// page transition
function animateBlocksBeforeUnload(event) {
  event.preventDefault();

  return new Promise((resolve) => {
    gsap.set(".block", { visibility: "visible", scaleY: 0 });
    gsap.to(".block", {
      scaleY: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.inOut",
      onComplete: resolve,
    });
  });
}
console.log("Script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const href = link.getAttribute("href");

      if (href && !href.startsWith("#") && href !== window.location.pathname) {
        animateTransition().then(() => {
          window.location.href = href;
        });
      }
    });
  });

  function animateTransition() {
    return new Promise((resolve) => {
      gsap.set(".block", { visibility: "visible", scaleY: 0 });
      gsap.to(".block", {
        scaleY: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }

  gsap.set(".block", { clearProps: "all" });
});
