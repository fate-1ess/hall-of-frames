// initial setup and data
const videos = [
  { name: "./videos/v1.mov" },
  { name: "./videos/v2.mov" },
  { name: "./videos/v3.mov" },
  { name: "./videos/v4.mov" },
  { name: "./videos/v5.mov" },
  { name: "./videos/v6.mov" },
  { name: "./videos/v7.mov" },
  { name: "./videos/v8.mov" },
  { name: "./videos/v9.mov" },
  { name: "./videos/v10.mov" },
];

// configuration parameters
const params = {
  rows: 7,
  columns: 7,
  curvature: 5,
  spacing: 10,
  imageWidth: 7,
  imageHeight: 4.5,
  depth: 7.5,
  elevation: 0,
  lookAtRange: 20,
  verticalCurvature: 0.5,
};

// scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// debug mode setup
const DEBUG_MODE = false;
let gui;
if (DEBUG_MODE) {
  gui = new dat.GUI();
  gui.add(params, "rows", 1, 8).onChange(updateGallery);
  gui.add(params, "columns", 1, 10).onChange(updateGallery);
  gui.add(params, "imageWidth", 1, 10).onChange(updateGallery);
  gui.add(params, "imageHeight", 1, 10).onChange(updateGallery);
  gui.add(params, "spacing", 2, 10).onChange(updateGallery);
  gui.add(params, "curvature", 0, 10).onChange(updateGallery);
  gui.add(params, "verticalCurvature", 0, 2).onChange(updateGallery);
  gui.add(params, "depth", 5, 50).onChange(updateGallery);
  gui.add(params, "elevation", -10, 10).onChange(updateGallery);
  gui.add(params, "lookAtRange", 5, 50).name("Look Range");
}

// header animation setup
const header = document.querySelector(".header");
let headerRotationX = 0;
let headerRotationY = 0;
let headerTranslateZ = 0;

// mouse movement variables
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const lookAtTarget = new THREE.Vector3(0, 0, 0);

// video utility functions
function createVideoElement(videoSource) {
  const video = document.createElement("video");
  video.src = videoSource;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.play();
  return video;
}

// gallery mathematics functions
function calculateRotations(x, y) {
  const a = 1 / (params.depth * params.curvature);
  const slopeY = -2 * a * x;
  const rotationY = Math.atan(slopeY);

  const verticalFactor = params.verticalCurvature;
  const maxYDistance = (params.rows * params.spacing) / 2;
  const normalizedY = y / maxYDistance;
  const rotationX = normalizedY * verticalFactor;

  return { rotationX, rotationY };
}

function calculatePosition(row, col) {
  let x = (col - params.columns / 2) * params.spacing;
  let y = (row - params.rows / 2) * params.spacing;

  let z = (x * x) / (params.depth * params.curvature);

  const normalizedY = y / ((params.rows * params.spacing) / 2);
  z += Math.abs(normalizedY) * normalizedY * params.verticalCurvature * 5;

  y += params.elevation;

  const { rotationX, rotationY } = calculateRotations(x, y);

  return { x, y, z, rotationX, rotationY };
}

// gallery creation functions
let images = [];

function createImagePlane(row, col) {
  const videoData = videos[Math.floor(Math.random() * videos.length)];

  const geometry = new THREE.PlaneGeometry(
    params.imageWidth,
    params.imageHeight
  );

  const video = createVideoElement(videoData.name);
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.DoubleSide,
  });

  const plane = new THREE.Mesh(geometry, material);
  const { x, y, z, rotationX, rotationY } = calculatePosition(row, col);

  plane.position.set(x, y, z);
  plane.rotation.x = rotationX;
  plane.rotation.y = rotationY;

  plane.userData.basePosition = { x, y, z };
  plane.userData.baseRotation = { x: rotationX, y: rotationY, z: 0 };
  plane.userData.parallaxFactor = Math.random() * 0.5 + 0.5;
  plane.userData.randomOffset = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1,
  };
  plane.userData.rotationModifier = {
    x: Math.random() * 0.15 - 0.075,
    y: Math.random() * 0.15 - 0.075,
    z: Math.random() * 0.2 - 0.1,
  };
  plane.userData.phaseOffset = Math.random() * Math.PI * 2;

  plane.userData.video = video;

  return plane;
}

function updateGallery() {
  images.forEach((plane) => {
    if (plane.userData.video) {
      plane.userData.video.pause();
      plane.userData.video.remove();
    }
    scene.remove(plane);
  });

  images = [];

  for (let row = 0; row < params.rows; row++) {
    for (let col = 0; col < params.columns; col++) {
      const plane = createImagePlane(row, col);
      images.push(plane);
      scene.add(plane);
    }
  }
}

// event listeners
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
  mouseY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

  headerRotationX = -mouseY * 30;
  headerRotationY = mouseX * 30;
  headerTranslateZ = Math.abs(mouseX * mouseY) * 50;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// animation loop
function animate() {
  requestAnimationFrame(animate);

  // update header transform
  const targetTransform = `
     translate(-50%, -50%)
     perspective(1000px)
     rotateX(${headerRotationX}deg)
     rotateY(${headerRotationY}deg)
     translateZ(${headerTranslateZ}px)
   `;

  header.style.transform = targetTransform;
  header.style.transition =
    "transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)";

  // update camera target
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  lookAtTarget.x = targetX * params.lookAtRange;
  lookAtTarget.y = -targetY * params.lookAtRange;
  lookAtTarget.z =
    (lookAtTarget.x * lookAtTarget.x) / (params.depth * params.curvature);

  const time = performance.now() * 0.001;

  // update each plane
  images.forEach((plane) => {
    const {
      basePosition,
      baseRotation,
      parallaxFactor,
      randomOffset,
      rotationModifier,
      phaseOffset,
    } = plane.userData;

    const mouseDistance = Math.sqrt(targetX * targetX + targetY * targetY);
    const parallaxX = targetX * parallaxFactor * 3 * randomOffset.x;
    const parallaxY = targetY * parallaxFactor * 3 * randomOffset.y;
    const oscillation = Math.sin(time + phaseOffset) * mouseDistance * 0.1;

    // update position
    plane.position.x =
      basePosition.x + parallaxX + oscillation * randomOffset.x;
    plane.position.y =
      basePosition.y + parallaxY + oscillation * randomOffset.y;
    plane.position.z =
      basePosition.z + oscillation * randomOffset.z * parallaxFactor;

    // update rotation
    plane.rotation.x =
      baseRotation.x +
      targetY * rotationModifier.x * mouseDistance +
      oscillation * rotationModifier.x * 0.2;

    plane.rotation.y =
      baseRotation.y +
      targetX * rotationModifier.y * mouseDistance +
      oscillation * rotationModifier.y * 0.2;

    plane.rotation.z =
      baseRotation.z +
      targetX * targetY * rotationModifier.z * 2 +
      oscillation * rotationModifier.z * 0.3;
  });

  camera.lookAt(lookAtTarget);
  renderer.render(scene, camera);
}

// initialize gallery and start animation
updateGallery();
animate();
