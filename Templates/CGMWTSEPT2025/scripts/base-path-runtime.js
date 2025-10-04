import { applyBasePathToDom } from "./base-path.js";

const run = () => {
  applyBasePathToDom();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run, { once: true });
} else {
  run();
}
