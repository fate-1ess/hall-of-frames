import { withBasePath } from "@/utils/base-path";

export default function SampleProject() {
  return (
    <div className="container">
      <p>Sample Project Page</p>
      <a href={withBasePath("/")}>[ Back ]</a>
    </div>
  );
}
