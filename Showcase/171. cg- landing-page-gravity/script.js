function splitTextIntoSpans(selector) {
  let elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    let text = element.innerText;
    let splitText = text
      .split("")
      .map(function (char) {
        return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
      })
      .join("");
    element.innerHTML = splitText;
  });
}

splitTextIntoSpans("h1");
const { Engine, Runner, World, Bodies, Body, Events } = Matter;

const engine = Engine.create({
  gravity: { x: 0, y: 0 },
});

const runner = Runner.create();
Runner.run(runner, engine);

const items = document.querySelectorAll(".item");
const initialPositions = Array.from(items).map((item) => ({
  x: item.offsetLeft,
  y: item.offsetTop,
  angle: 0,
}));

const bodies = Array.from(items).map((item, index) => {
  const body = Bodies.rectangle(
    initialPositions[index].x + item.offsetWidth / 2,
    initialPositions[index].y + item.offsetHeight / 2,
    item.offsetWidth,
    item.offsetHeight,
    {
      restitution: 0.75,
      friction: 0.5,
      frictionAir: 0.0175,
      isStatic: true,
    }
  );
  World.add(engine.world, body);
  return body;
});

const floor = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight + 5,
  window.innerWidth,
  20,
  { isStatic: true }
);
World.add(engine.world, floor);

let gravityEnabled = false;
let animationFrame;
let isAnimating = false;

const duration = 0.75;
const easeOutQuad = (t) => t * (2 - t);

const overlay = document.querySelector(".overlay");
const toggleClipPath = () => {
  const overlayProps = {
    clipPath: gravityEnabled
      ? "polygon(5% 60%, 95% 60%, 95% 100%, 5% 100%)"
      : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1.5,
    ease: "power3.inOut",
  };

  const buttonProps = {
    color: gravityEnabled ? "#fff" : "#000",
    delay: 0.5,
    duration: 1,
  };

  const textProps = {
    y: gravityEnabled ? 0 : 30,
    delay: gravityEnabled ? 0.75 : 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.1 * (gravityEnabled ? 1 : -1),
  };

  const h1Props = {
    fontSize: gravityEnabled ? "20vw" : "10vw",
    duration: 1,
    ease: "power4.inOut",
    stagger: gravityEnabled ? -0.035 : 0.035,
  };

  const h1PosProps = {
    left: gravityEnabled ? "32.5%" : "0%",
    duration: 1,
    ease: "power4.inOut",
  };

  gsap.to(overlay, overlayProps);
  gsap.to("#toggle-btn", buttonProps);

  gsap.to(".overlay h1", h1PosProps);
  gsap.to(".overlay h1 span", h1Props);
  document.querySelectorAll(".col").forEach((col) => {
    gsap.to(col.querySelectorAll(".line p"), textProps);
  });
};

document.getElementById("toggle-btn").addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;

  if (!gravityEnabled) {
    engine.world.gravity.y = 1;
    bodies.forEach((body) => {
      Body.setStatic(body, false);
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
    });
    gravityEnabled = true;
  } else {
    engine.world.gravity.y = 0;
    bodies.forEach((body, index) => {
      Body.setStatic(body, true);
      const startPos = { x: body.position.x, y: body.position.y };
      const startAngle = body.angle;
      const endPos = {
        x: initialPositions[index].x + items[index].offsetWidth / 2,
        y: initialPositions[index].y + items[index].offsetHeight / 2,
      };
      const endAngle = 0;
      const startTime = performance.now();

      const animateBack = (currentTime) => {
        const elapsedTime = (currentTime - startTime) / 1000;
        const t = Math.min(elapsedTime / duration, 1);
        const easedT = easeOutQuad(t);

        const x = startPos.x + easedT * (endPos.x - startPos.x);
        const y = startPos.y + easedT * (endPos.y - startPos.y);
        const angle = startAngle + easedT * (endAngle - startAngle);

        setTimeout(() => {
          Body.setPosition(body, { x, y });
          Body.setAngle(body, angle);
        }, 750);

        if (t < 1) {
          animationFrame = requestAnimationFrame(animateBack);
        }
      };

      animationFrame = requestAnimationFrame(animateBack);
    });
    gravityEnabled = false;
  }

  toggleClipPath();

  setTimeout(() => {
    isAnimating = false;
  }, 2000);
});

Events.on(engine, "afterUpdate", () => {
  bodies.forEach((body, index) => {
    const item = items[index];
    item.style.top = `${body.position.y - item.offsetHeight / 2}px`;
    item.style.left = `${body.position.x - item.offsetWidth / 2}px`;
    item.style.transform = `rotate(${body.angle}rad)`;
  });
});
