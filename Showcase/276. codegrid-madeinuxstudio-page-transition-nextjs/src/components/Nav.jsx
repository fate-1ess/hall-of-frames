import { withBasePath } from "@/utils/base-path";

const Nav = () => {
  return (
    <nav>
      <div className="nav-logo">
        <a href={withBasePath("/")}>Silhouette</a>
      </div>
      <div className="nav-links">
        <a href={withBasePath("/")}>Index</a>
        <a href={withBasePath("/archive")}>Archive</a>
        <a href={withBasePath("/contact")}>Contact</a>
      </div>
    </nav>
  );
};

export default Nav;
