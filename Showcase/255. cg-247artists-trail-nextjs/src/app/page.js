import TrailContainer from "@/components/TrailContainer";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-img">
          <img src="/hero.jpg" alt="" />
        </div>
        <p>[ The Future Moves in Frames ]</p>
        <p>Experiment 457 by Codegrd</p>

        <TrailContainer />
      </section>
    </>
  );
}
