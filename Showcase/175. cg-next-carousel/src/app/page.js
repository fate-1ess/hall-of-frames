import Image from "next/image";
import styles from "./page.module.css";

import NavBar from "@/components/navbar/NavBar";
import Slider from "@/components/slider/Slider";

export default function Home() {
  return (
    <>
      <NavBar />
      <Slider />
    </>
  );
}
