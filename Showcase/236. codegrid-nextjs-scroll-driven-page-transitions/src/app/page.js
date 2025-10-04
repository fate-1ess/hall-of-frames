import { withAssetPrefix } from "@/utils/base-path";

export default function Home() {
  const projectsHref = withAssetPrefix("/projects");

  return (
    <div className="home">
      <div className="link">
        <span>&#8594;</span>
        <a href={projectsHref}>All Projects</a>
      </div>
    </div>
  );
}
