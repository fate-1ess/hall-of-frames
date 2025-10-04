import img1 from "../assets/project-images/img1.jpg";
import img2 from "../assets/project-images/img2.jpg";
import img3 from "../assets/project-images/img3.jpg";
import img4 from "../assets/project-images/img4.jpg";
import img5 from "../assets/project-images/img5.jpg";
import img6 from "../assets/project-images/img6.jpg";
import img7 from "../assets/project-images/img7.jpg";
import img8 from "../assets/project-images/img8.jpg";
import img9 from "../assets/project-images/img9.jpg";
import img10 from "../assets/project-images/img10.jpg";
import img11 from "../assets/project-images/img11.jpg";

const assetMap = new Map();

const registerAsset = (fileName, asset) => {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const variants = [
    fileName,
    baseName,
    `/src/assets/project-images/${fileName}`,
    `src/assets/project-images/${fileName}`,
    `../assets/project-images/${fileName}`,
    `./assets/project-images/${fileName}`,
    `/assets/project-images/${fileName}`,
  ];

  variants.forEach((key) => {
    if (!assetMap.has(key)) {
      assetMap.set(key, asset);
    }
  });
};

[
  ["img1.jpg", img1],
  ["img2.jpg", img2],
  ["img3.jpg", img3],
  ["img4.jpg", img4],
  ["img5.jpg", img5],
  ["img6.jpg", img6],
  ["img7.jpg", img7],
  ["img8.jpg", img8],
  ["img9.jpg", img9],
  ["img10.jpg", img10],
  ["img11.jpg", img11],
].forEach(([fileName, asset]) => registerAsset(fileName, asset));

export const resolveAssetPath = (inputPath) => {
  if (!inputPath) return inputPath;
  return assetMap.get(inputPath) ?? inputPath;
};