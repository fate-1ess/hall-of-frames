import ExplosionContainer from "@/components/ExplosionContainer";

const getAssetPrefix = () =>
  process.env.NEXT_PUBLIC_ASSET_PREFIX ??
  process.env.NEXT_PUBLIC_BASE_PATH ??
  "";

const withAssetPrefix = (path) => {
  const prefix = getAssetPrefix();
  const sanitizedPrefix = prefix.endsWith("/")
    ? prefix.slice(0, -1)
    : prefix;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return sanitizedPrefix ? `${sanitizedPrefix}${normalizedPath}` : normalizedPath;
};

export default function Home() {
  const heroStyle = {
    backgroundImage: `url(${withAssetPrefix("/assets/hero.jpg")})`,
  };

  const outroStyle = {
    backgroundImage: `url(${withAssetPrefix("/assets/outro.jpg")})`,
  };

  const explosionImages = Array.from({ length: 15 }, (_, i) =>
    withAssetPrefix(`/assets/img${i + 1}.jpg`)
  );

  return (
    <>
      <section className="hero" style={heroStyle}></section>

      <section className="about">
        <p>
          The world collapsed, but the game survived. In the neon-lit ruins of
          civilization, the last remnants of power aren’t in governments or
          corporations—they’re in the **Oblivion Decks**. Each card carries a
          fragment of lost history, a code of survival, a weapon of deception.
          The elite hoard them. The rebels steal them. The desperate gamble
          their lives for them. Do you have what it takes to **play the game
          that decides the future**?
        </p>
      </section>

      <section className="outro" style={outroStyle}></section>

      <footer>
        <h1>The future is in your hands</h1>
        <div className="copyright-info">
          <p>&copy; 2025 Oblivion Decks</p>
          <p>All rights reserved.</p>
        </div>

        <ExplosionContainer images={explosionImages} />
      </footer>
    </>
  );
}
