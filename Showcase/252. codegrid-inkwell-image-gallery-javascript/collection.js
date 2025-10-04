import { withBasePath } from "./base-path.js";

const collection = [
  { title: "Shadow Profile", file: "img1.jpeg" },
  { title: "Crimson Silhouette", file: "img2.jpeg" },
  { title: "Wavelength", file: "img3.jpeg" },
  { title: "Noir Figure", file: "img4.jpeg" },
  { title: "Midnight Gaze", file: "img5.jpeg" },
  { title: "Cobalt Contrast", file: "img6.jpeg" },
  { title: "Half-Light", file: "img7.jpeg" },
  { title: "Scarlet Frame", file: "img8.jpeg" },
  { title: "Pale Vision", file: "img9.jpeg" },
  { title: "Spectral Form", file: "img10.jpeg" },
  { title: "Monochrome Motion", file: "img11.jpeg" },
  { title: "Platinum Edge", file: "img12.jpeg" },
  { title: "Electric Shade", file: "img13.jpeg" },
  { title: "Veiled Light", file: "img14.jpeg" },
  { title: "Luminous Dark", file: "img15.jpeg" },
  { title: "Haze Portrait", file: "img16.jpeg" },
  { title: "Glowing Contour", file: "img17.jpeg" },
  { title: "Dark Elegance", file: "img18.jpeg" },
  { title: "Ruby Accent", file: "img19.jpeg" },
  { title: "Clear Gaze", file: "img20.jpeg" },
].map((item) => ({
  title: item.title,
  img: withBasePath(`/${item.file}`),
}));

export default collection;
