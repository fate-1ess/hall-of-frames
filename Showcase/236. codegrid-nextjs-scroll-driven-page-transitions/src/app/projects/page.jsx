import projects from "../../projects";
import { withAssetPrefix } from "@/utils/base-path";

export default function Projects() {
  const getProjectHref = (slug) => withAssetPrefix(`/projects/${slug}`);

  return (
    <ul className="projects-list">
      {projects.map((project) => (
        <li key={project.id}>
          <div className="link">
            <span>&#8594;&nbsp;</span>
            <a href={getProjectHref(project.slug)}>{project.title}</a>
          </div>
        </li>
      ))}
    </ul>
  );
}
