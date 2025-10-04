import { resolveAssetPath, resolvePagePath } from "@/utils/base-path";

export const carouselItems = [
  {
    id: "101",
    title: "Starlight Reverie Celestial",
    bg: resolveAssetPath("images/carousel/carousel1.jpeg"),
    main: resolveAssetPath("images/carousel/carousel1.jpeg"),
    url: resolvePagePath("/archive"),
  },
  {
    id: "102",
    title: "The Infinite Eternity Flow",
    bg: resolveAssetPath("images/carousel/carousel2.jpeg"),
    main: resolveAssetPath("images/carousel/carousel2.jpeg"),
    url: resolvePagePath("/archive"),
  },
  {
    id: "103",
    title: "Aurora's Horizon Colors",
    bg: resolveAssetPath("images/carousel/carousel3.jpeg"),
    main: resolveAssetPath("images/carousel/carousel3.jpeg"),
    url: resolvePagePath("/archive"),
  },
];
