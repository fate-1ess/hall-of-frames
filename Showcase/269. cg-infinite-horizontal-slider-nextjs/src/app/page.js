import Slider from "@/components/Slider/Slider";

export default function Home() {
  return (
    <>
      <nav>
        <div className="logo">
          <a href="#">Glasswake</a>
        </div>
        <div className="nav-links">
          <a href="#">Work</a>
          <a href="#">Studio</a>
          <a href="#">Contact</a>
        </div>
      </nav>
      <Slider />
      <footer>
        <p>Experiment 0471</p>
        <p>Built by Codegrid</p>
      </footer>
    </>
  );
}
