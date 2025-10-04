const assetPrefix = import.meta.env.BASE_URL;
const withBase = (path) => `${assetPrefix}${path.replace(/^\/+/, "")}`;

const slides = [
  {
    tag: "Website",
    marquee: "Eclipse Interactive Art Portfolio",
    image: withBase("slide-img-1.jpg"),
  },
  {
    tag: "Branding",
    marquee: "Solaris Avant-Garde Brand Identity",
    image: withBase("slide-img-2.jpg"),
  },
  {
    tag: "Experience",
    marquee: "Nova Immersive Light Exhibition",
    image: withBase("slide-img-3.jpg"),
  },
  {
    tag: "Website",
    marquee: "Luminex Virtual Reality Showcase",
    image: withBase("slide-img-4.jpg"),
  },
  {
    tag: "Marketing",
    marquee: "Orion Digital Art Launch Campaign",
    image: withBase("slide-img-5.jpg"),
  },
];

export default slides;
