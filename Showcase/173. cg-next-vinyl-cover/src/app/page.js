import styles from "./page.module.css";
const COVER_IMAGE_SRC = "/sample-cover.jpg";

import VinylPlayerAnimation from "@/components/VinylPlayerAnimation/VinylPlayerAnimation";

export default function Home() {
  return (
    <>
      <VinylPlayerAnimation
        textsPrimary={[
          "Fly to the moon now",
          "Fly to the moon now",
          "Fly to the moon now",
        ]}
        textSecondary="Throwback Music Vol"
        coverImg={COVER_IMAGE_SRC}
      />
    </>
  );
}
