const assetPrefix = import.meta.env.BASE_URL;

const withBase = (path) => `${assetPrefix}${path.replace(/^\/+/, "")}`;

const slides = [
  {
    title: "Desert Oasis Pool",
    image: withBase("img1.jpg"),
    url: "#",
  },
  {
    title: "Domed Sanctuary",
    image: withBase("img2.jpg"),
    url: "#",
  },
  {
    title: "Courtyard Retreat",
    image: withBase("img3.jpg"),
    url: "#",
  },
  {
    title: "Arched Corridor",
    image: withBase("img4.jpg"),
    url: "#",
  },
  {
    title: "Illuminated Grotto",
    image: withBase("img5.jpg"),
    url: "#",
  },
];

export default slides;
