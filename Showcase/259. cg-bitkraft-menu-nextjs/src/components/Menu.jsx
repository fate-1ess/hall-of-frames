"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Script from "next/script";
import { withBasePath } from "../utils/base-path";

const Menu = () => {
  const menuRef = useRef(null);
  const joystickRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuOverlayNavRef = useRef(null);
  const menuOverlayFooterRef = useRef(null);

  const isOpenRef = useRef(false);
  const isMenuAnimatingRef = useRef(false);
  const responsiveConfigRef = useRef({});
  const isDraggingRef = useRef(false);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const activeSegmentRef = useRef(null);
  const animationFrameRef = useRef(null);

  const menuItems = [
    { label: "Vision", icon: "scan-sharp", href: "/vision" },
    { label: "Portfolio", icon: "layers-sharp", href: "/portfolio" },
    { label: "People", icon: "person-sharp", href: "/people" },
    { label: "Insights", icon: "browsers-sharp", href: "/insights" },
    { label: "Careers", icon: "stats-chart-sharp", href: "/careers" },
    { label: "About Us", icon: "reader-sharp", href: "/about" },
  ];

  const getResponsiveConfig = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = viewportWidth < 1000;

    const maxSize = Math.min(viewportWidth * 0.9, viewportHeight * 0.9);
    const menuSize = isMobile ? Math.min(maxSize, 480) : 700;

    return {
      menuSize,
      center: menuSize / 2,
      innerRadius: menuSize * 0.08,
      outerRadius: menuSize * 0.42,
      contentRadius: menuSize * 0.28,
    };
  };

  const playSound = (path) => {
    try {
      new Audio(withBasePath(path)).play();
    } catch (e) {}
  };

  const createSegment = (item, index, total) => {
    const segment = document.createElement("a");
    segment.className = "menu-segment";
    segment.href = withBasePath(item.href);

    const { menuSize, center, innerRadius, outerRadius, contentRadius } =
      responsiveConfigRef.current;

    const anglePerSegment = 360 / total;
    const baseStartAngle = anglePerSegment * index;
    const centerAngle = baseStartAngle + anglePerSegment / 2;
    const startAngle = baseStartAngle + 0.19;
    const endAngle = baseStartAngle + anglePerSegment - 0.19;

    const innerStartX =
      center + innerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const innerStartY =
      center + innerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const outerStartX =
      center + outerRadius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const outerStartY =
      center + outerRadius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const innerEndX =
      center + innerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const innerEndY =
      center + innerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);
    const outerEndX =
      center + outerRadius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const outerEndY =
      center + outerRadius * Math.sin(((endAngle - 90) * Math.PI) / 180);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${innerStartX} ${innerStartY}`,
      `L ${outerStartX} ${outerStartY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      "Z",
    ].join(" ");

    segment.style.clipPath = `path('${pathData}')`;
    segment.style.width = `${menuSize}px`;
    segment.style.height = `${menuSize}px`;

    const contentX =
      center + contentRadius * Math.cos(((centerAngle - 90) * Math.PI) / 180);
    const contentY =
      center + contentRadius * Math.sin(((centerAngle - 90) * Math.PI) / 180);

    segment.innerHTML = `
      <div class="segment-content" 
        style="left: ${contentX}px; top: ${contentY}px; transform: translate(-50%, -50%);">
        <ion-icon name="${item.icon}"></ion-icon>
        <div class="label">${item.label}</div>
      </div>
    `;

    return segment;
  };

  const toggleMenu = () => {
    if (isMenuAnimatingRef.current) return;

    const menuOverlay = menuOverlayRef.current;
    const menuSegments = menuRef.current.querySelectorAll(".menu-segment");
    const joystick = joystickRef.current;
    const menuOverlayNav = menuOverlayNavRef.current;
    const menuOverlayFooter = menuOverlayFooterRef.current;

    isMenuAnimatingRef.current = true;

    if (!isOpenRef.current) {
      isOpenRef.current = true;
      playSound("/menu-open.mp3");

      gsap.to(menuOverlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => (menuOverlay.style.pointerEvents = "all"),
      });

      gsap.to(joystick, {
        scale: 1,
        duration: 0.4,
        delay: 0.2,
        ease: "back.out(1.7)",
      });

      gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 0 });
      gsap.to([menuOverlayNav, menuOverlayFooter], {
        opacity: 1,
        duration: 0.075,
        delay: 0.3,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () =>
          gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 1 }),
      });

      [...Array(menuSegments.length).keys()]
        .sort(() => Math.random() - 0.5)
        .forEach((originalIndex, shuffledPosition) => {
          const segment = menuSegments[originalIndex];
          gsap.set(segment, { opacity: 0 });
          gsap.to(segment, {
            opacity: 1,
            duration: 0.075,
            delay: shuffledPosition * 0.075,
            repeat: 3,
            yoyo: true,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(segment, { opacity: 1 });
              if (originalIndex === menuSegments.length - 1) {
                isMenuAnimatingRef.current = false;
              }
            },
          });
        });
    } else {
      isOpenRef.current = false;
      playSound("/menu-close.mp3");

      gsap.to([menuOverlayNav, menuOverlayFooter], {
        opacity: 0,
        duration: 0.05,
        repeat: 2,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () =>
          gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 0 }),
      });

      gsap.to(joystick, {
        scale: 0,
        duration: 0.3,
        delay: 0.2,
        ease: "back.in(1.7)",
      });

      [...Array(menuSegments.length).keys()]
        .sort(() => Math.random() - 0.5)
        .forEach((originalIndex, shuffledPosition) => {
          const segment = menuSegments[originalIndex];
          gsap.to(segment, {
            opacity: 0,
            duration: 0.05,
            delay: shuffledPosition * 0.05,
            repeat: 2,
            yoyo: true,
            ease: "power2.inOut",
            onComplete: () => gsap.set(segment, { opacity: 0 }),
          });
        });

      gsap.to(menuOverlay, {
        opacity: 0,
        duration: 0.3,
        delay: 0.6,
        ease: "power2.out",
        onComplete: () => {
          menuOverlay.style.pointerEvents = "none";
          isMenuAnimatingRef.current = false;
        },
      });
    }
  };

  const initCenterDrag = () => {
    const joystick = joystickRef.current;

    const animate = () => {
      currentXRef.current += (targetXRef.current - currentXRef.current) * 0.15;
      currentYRef.current += (targetYRef.current - currentYRef.current) * 0.15;

      gsap.set(joystick, {
        x: currentXRef.current,
        y: currentYRef.current,
      });

      if (
        isDraggingRef.current &&
        Math.sqrt(
          currentXRef.current * currentXRef.current +
            currentYRef.current * currentYRef.current
        ) > 20
      ) {
        const angle =
          Math.atan2(currentYRef.current, currentXRef.current) *
          (180 / Math.PI);
        const segmentIndex =
          Math.floor(((angle + 90 + 360) % 360) / (360 / menuItems.length)) %
          menuItems.length;
        const segment =
          menuRef.current.querySelectorAll(".menu-segment")[segmentIndex];

        if (segment !== activeSegmentRef.current) {
          if (activeSegmentRef.current) {
            activeSegmentRef.current.style.animation = "";
            activeSegmentRef.current.querySelector(
              ".segment-content"
            ).style.animation = "";
            activeSegmentRef.current.style.zIndex = "";
          }
          activeSegmentRef.current = segment;
          segment.style.animation = "flickerHover 350ms ease-in-out forwards";
          segment.querySelector(".segment-content").style.animation =
            "contentFlickerHover 350ms ease-in-out forwards";
          segment.style.zIndex = "10";
          if (isOpenRef.current) {
            playSound("/menu-select.mp3");
          }
        }
      } else {
        if (activeSegmentRef.current) {
          activeSegmentRef.current.style.animation = "";
          activeSegmentRef.current.querySelector(
            ".segment-content"
          ).style.animation = "";
          activeSegmentRef.current.style.zIndex = "";
          activeSegmentRef.current = null;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const drag = (e) => {
        if (!isDraggingRef.current) return;
        const deltaX = (e.clientX || e.touches?.[0]?.clientX) - centerX;
        const deltaY = (e.clientY || e.touches?.[0]?.clientY) - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDrag = 100 * 0.25;

        if (distance <= 20) {
          targetXRef.current = targetYRef.current = 0;
        } else if (distance > maxDrag) {
          const ratio = maxDrag / distance;
          targetXRef.current = deltaX * ratio;
          targetYRef.current = deltaY * ratio;
        } else {
          targetXRef.current = deltaX;
          targetYRef.current = deltaY;
        }
        e.preventDefault();
      };

      const endDrag = () => {
        isDraggingRef.current = false;
        targetXRef.current = targetYRef.current = 0;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
      };

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", endDrag);
      e.preventDefault();
    };

    joystick.addEventListener("mousedown", handleMouseDown);
    animate();
  };

  useEffect(() => {
    responsiveConfigRef.current = getResponsiveConfig();

    const menu = menuRef.current;
    const joystick = joystickRef.current;
    const menuOverlayNav = menuOverlayNavRef.current;
    const menuOverlayFooter = menuOverlayFooterRef.current;

    menu.style.width = `${responsiveConfigRef.current.menuSize}px`;
    menu.style.height = `${responsiveConfigRef.current.menuSize}px`;

    gsap.set(joystick, { scale: 0 });
    gsap.set([menuOverlayNav, menuOverlayFooter], { opacity: 0 });

    menuItems.forEach((item, index) => {
      const segment = createSegment(item, index, menuItems.length);
      segment.addEventListener("mouseenter", () => {
        if (isOpenRef.current) {
          playSound("/menu-select.mp3");
        }
      });
      menu.appendChild(segment);
    });

    initCenterDrag();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="menu-toggle-btn" onClick={toggleMenu}>
        <div className="hamburger-bar"></div>
        <div className="hamburger-bar"></div>
      </div>

      <div className="menu-overlay" ref={menuOverlayRef}>
        <div className="menu-bg"></div>

        <div className="menu-overlay-nav" ref={menuOverlayNavRef}>
          <div className="close-btn" onClick={toggleMenu}>
            <div className="close-btn-bar"></div>
            <div className="close-btn-bar"></div>
          </div>
          <div className="menu-overlay-items">
            <a href="#">
              <ion-icon name="logo-google"></ion-icon>
            </a>
            <a href="#">
              <ion-icon name="logo-github"></ion-icon>
            </a>
            <a href="">
              <ion-icon name="logo-vercel"></ion-icon>
            </a>
          </div>
        </div>

        <div className="menu-overlay-footer" ref={menuOverlayFooterRef}>
          <p>Copyright &copy; 2025 All Rights Reserved</p>
          <div className="menu-overlay-items">
            <a href="#">Cookie Settings</a>
            <a href="#">Privacy Policy</a>
            <a href="">Legal Disclaimer</a>
          </div>
        </div>

        <div className="circular-menu" ref={menuRef}>
          <div className="joystick" ref={joystickRef}>
            <ion-icon
              name="grid-sharp"
              className="center-icon center-main"
            ></ion-icon>
            <ion-icon
              name="chevron-up-sharp"
              className="center-icon center-up"
            ></ion-icon>
            <ion-icon
              name="chevron-down-sharp"
              className="center-icon center-down"
            ></ion-icon>
            <ion-icon
              name="chevron-back-sharp"
              className="center-icon center-left"
            ></ion-icon>
            <ion-icon
              name="chevron-forward-sharp"
              className="center-icon center-right"
            ></ion-icon>
          </div>
        </div>

        <Script
          type="module"
          src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/7.1.0/ionicons/ionicons.esm.js"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/7.1.0/ionicons/ionicons.js"
          strategy="afterInteractive"
        />
      </div>
    </>
  );
};

export default Menu;
