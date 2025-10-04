// lenis scroll
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// canvas trail
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
}

resizeCanvas();

let xMousePos = 0;
let yMousePos = 0;
let lastScrolledLeft = 0;
let lastScrolledTop = 0;
let lastX = null;
let lastY = null;
let hasMouseMoved = false;

ctx.lineWidth = 24;
ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
ctx.lineCap = "round";
ctx.filter = "blur(12px)";

function drawLine(newX, newY) {
  if (lastX !== null && lastY !== null) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(newX, newY);
    ctx.stroke();
  }
  lastX = newX;
  lastY = newY;
}

document.addEventListener("mousemove", function (event) {
  if (!hasMouseMoved) {
    lastX = event.pageX;
    lastY = event.pageY;
    hasMouseMoved = true;
  } else {
    xMousePos = event.pageX;
    yMousePos = event.pageY;
    drawLine(xMousePos, yMousePos);
  }
});

window.addEventListener("scroll", function () {
  const xScrollDelta = window.scrollX - lastScrolledLeft;
  const yScrollDelta = window.scrollY - lastScrolledTop;

  if (xScrollDelta !== 0 || yScrollDelta !== 0) {
    xMousePos += xScrollDelta;
    yMousePos += yScrollDelta;
    drawLine(xMousePos, yMousePos);
  }

  lastScrolledLeft = window.screenX;
  lastScrolledTop = window.scrollY;
});

window.addEventListener("resize", resizeCanvas);
