import Image from "next/image";
import styles from "./page.module.css";

import DynamicBackground from "@/components/DynamicBackground";

export default function Home() {
  return (
    <>
      <DynamicBackground logoPath="/logo.png" />
    </>
  );
}
