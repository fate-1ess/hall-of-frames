const assetPrefix = import.meta.env.BASE_URL;
const withBase = (path) => `${assetPrefix}${path.replace(/^\/+/, "")}`;

const products = [
  {
    name: "Obsidian Puffer",
    img: withBase("products/product-1.png"),
    price: 240,
    tag: "Outerwear",
    url: "https://store.example.com/obsidian-puffer",
  },
  {
    name: "Slate Joggers",
    img: withBase("products/product-2.png"),
    price: 160,
    tag: "Essentials",
    url: "https://store.example.com/slate-joggers",
  },
  {
    name: "Noir Shirt",
    img: withBase("products/product-3.png"),
    price: 190,
    tag: "Classic",
    url: "https://store.example.com/noir-shirt",
  },
  {
    name: "Ash Knit",
    img: withBase("products/product-4.png"),
    price: 220,
    tag: "Core Piece",
    url: "https://store.example.com/ash-knit",
  },
  {
    name: "Form Jacket",
    img: withBase("products/product-5.png"),
    price: 280,
    tag: "Minimal",
    url: "https://store.example.com/form-jacket",
  },
  {
    name: "Carbon Trousers",
    img: withBase("products/product-6.png"),
    price: 210,
    tag: "Tailored",
    url: "https://store.example.com/carbon-trousers",
  },
  {
    name: "Edge Vest",
    img: withBase("products/product-7.png"),
    price: 150,
    tag: "Layer",
    url: "https://store.example.com/edge-vest",
  },
  {
    name: "Grain Tee",
    img: withBase("products/product-8.png"),
    price: 130,
    tag: "Everyday",
    url: "https://store.example.com/grain-tee",
  },
  {
    name: "Stone Cap",
    img: withBase("products/product-9.png"),
    price: 95,
    tag: "Accessory",
    url: "https://store.example.com/stone-cap",
  },
  {
    name: "Void Coat",
    img: withBase("products/product-10.png"),
    price: 310,
    tag: "Statement",
    url: "https://store.example.com/void-coat",
  },
];

export default products;
