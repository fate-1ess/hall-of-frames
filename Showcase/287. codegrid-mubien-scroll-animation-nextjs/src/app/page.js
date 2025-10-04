import { ReactLenis } from "lenis/react";
import Work from "@/components/Work/Work";

export default function Home() {
  return (
    <>
      <ReactLenis root>
        <header>
          <h1>Featured Work</h1>
        </header>

        <Work />

        <footer>
          <p>Developed by Codegrid</p>
          <p>All rights reserved &copy; 2025</p>
        </footer>
      </ReactLenis>
    </>
  );
}
