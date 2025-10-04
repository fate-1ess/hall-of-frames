import { ReactLenis } from "lenis/react";
import SpotlightSection from "@/components/Spotlight";

export default function Page() {
  return (
    <>
      <ReactLenis root>
        <section className="intro">
          <h1>Visions That Move Beyond the Surface</h1>
        </section>

        <SpotlightSection />

        <section className="outro">
          <h1>The Future Begins Where This Moment Ends</h1>
        </section>
      </ReactLenis>
    </>
  );
}
