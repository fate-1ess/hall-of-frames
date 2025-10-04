import gsap from "https://cdn.skypack.dev/gsap@3.12.5";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap@3.12.5/ScrollTrigger";

import { CATEGORY_MAP, PROJECTS, GENERATED_AT } from "./projects.js";

gsap.registerPlugin(ScrollTrigger);

const STACK_GROUPS = [
  { id: "all", label: "All stacks" },
  { id: "vanilla", label: "HTML • CSS • JS" },
  { id: "next", label: "Next.js" },
  { id: "react", label: "React & Vite" },
];

const FOCUS_DEFINITIONS = [
  {
    id: "text-animations",
    label: "Text animations",
    matcher: (project) =>
      hasAnyTag(project, ["text", "typography", "headline", "letters", "typewriter"]) ||
      (matchesKeywords(project, /(text|headline|typography|glyph|type|word)/) &&
        matchesKeywords(project, /(animate|reveal|split|scramble|kinetic|typewriter)/)),
  },
  {
    id: "navigation-scroll",
    label: "Menu & navigation scroll",
    matcher: (project) => {
      const hasNav =
        hasAnyTag(project, ["navigation", "menu", "navbar", "sidebar", "mega", "drawer"]) ||
        matchesKeywords(project, /(menu|nav|navbar|sidebar|drawer|mega menu|navigation)/);
      if (!hasNav) return false;
      const hasScrollCue =
        hasAnyTag(project, ["scroll", "sticky", "locomotive", "pin", "parallax"]) ||
        matchesKeywords(project, /(scroll|sticky|pin|locomotive|smooth scroll|parallax)/);
      return hasScrollCue || hasNav;
    },
  },
  {
    id: "hover-effects",
    label: "Hover effects",
    matcher: (project) =>
      hasAnyTag(project, ["hover", "cursor", "pointer", "magnetic", "tooltip", "tilt"]) ||
      matchesKeywords(project, /(hover|cursor|magnet|follow|parallax hover|tilt|distortion)/),
  },
  {
    id: "landing-animations",
    label: "Landing page animations",
    matcher: (project) => {
      const looksLikeTransition =
        hasAnyTag(project, ["transition", "page-transition", "router"]) ||
        matchesKeywords(project, /(page[-\s]?transition|view[-\s]?transition|swup|barba)/);
      if (looksLikeTransition) return false;
      return (
        hasAnyTag(project, ["landing", "hero", "agency", "portfolio", "marketing", "case-study"]) ||
        matchesKeywords(project, /(landing|homepage|hero section|agency|portfolio|studio|case study|campaign)/)
      );
    },
  },
  {
    id: "page-transitions",
    label: "Page transitions",
    matcher: (project) =>
      hasAnyTag(project, ["transition", "page-transition", "router", "view-transition", "navigation-transition"]) ||
      matchesKeywords(project, /(page[-\s]?transition|view[-\s]?transition|route transition|swup|barba|instant page|lenis transition)/),
  },
  {
    id: "preloaders",
    label: "Preloaders",
    matcher: (project) =>
      hasAnyTag(project, ["preloader", "loading", "loader", "progress", "intro"]) ||
      matchesKeywords(project, /(preload|loader|loading screen|progress indicator|intro loader|warmup)/),
  },
  {
    id: "sliders-galleries",
    label: "Sliders & image galleries",
    matcher: (project) =>
      hasAnyTag(project, ["slider", "carousel", "gallery", "marquee", "scroller", "swiper", "loop"]) ||
      matchesKeywords(project, /(slider|carousel|gallery|slideshow|image trail|draggable gallery|marquee)/),
  },
  {
    id: "webgl-shaders",
    label: "WebGL & shader 3D",
    matcher: (project) =>
      hasAnyTag(project, ["threejs", "webgl", "shader", "glsl", "3d", "three", "canvas", "raymarch"]) ||
      matchesKeywords(project, /(webgl|shader|glsl|three\.js|3d|particle|raymarch|depth|vertex)/),
  },
];

const FOCUS_GROUPS = [
  { id: "all", label: "All categories" },
  ...FOCUS_DEFINITIONS,
  { id: "misc", label: "Other components" },
];

const FEATURED_SORTER = buildFeaturedSorter();

const state = {
  category: "all",
  stack: "all",
  focus: "all",
  query: "",
};

const REPOSITORY_ROOT = "https://github.com/fate-1ess/hall-of-frames/tree/main/";

const elements = {
  projectList: document.querySelector("[data-project-list]"),
  visibleCount: document.querySelector("[data-visible-count]"),
  totalInline: document.querySelector("[data-total-inline]"),
  totalCount: document.querySelector("[data-total-count]"),
  categoryTotal: document.querySelector("[data-category-total]"),
  categoryCounts: document.querySelectorAll("[data-category-count]"),
  generatedAt: document.querySelector("[data-generated-at]") ?? null,
  searchInput: document.querySelector("[data-search-input]"),
  categoryFilter: document.querySelector("[data-filter-category]"),
  stackFilter: document.querySelector("[data-filter-stack]"),
  focusFilter: document.querySelector("[data-filter-focus]"),
  menuVisibleCount: document.querySelector("[data-menu-visible-count]"),
  menuTotalCount: document.querySelector("[data-menu-total-count]"),
  activeSummary: document.querySelector("[data-filter-active-summary]"),
  activeTotal: document.querySelector("[data-filter-active-total]"),
  menuActiveSummary: document.querySelector("[data-menu-active-summary]"),
  menuActiveTotal: document.querySelector("[data-menu-active-total]"),
  filterMenuRoot: document.querySelector("[data-filter-menu]"),
  filtersRoot: document.getElementById("filters"),
  resetButtons: document.querySelectorAll("[data-reset]"),
  previewPanel: document.querySelector("[data-preview-panel]"),
  previewFrame: document.querySelector("[data-preview-frame]"),
  previewInstructions: document.querySelector("[data-preview-instructions]"),
  previewTitle: document.querySelector("[data-preview-title]"),
  previewClose: document.querySelector("[data-preview-close]"),
  previewDialog: document.querySelector("[data-preview-dialog]"),
};

const filterRefs = {
  category: new Map(),
  stack: new Map(),
  focus: new Map(),
};

const projects = enrichProjects(PROJECTS);
let currentPreviewId = null;
let animationsInitialized = false;
const filterMenuController = {
  root: null,
  shell: null,
  timeline: null,
  toggles: [],
  closeButtons: [],
  menuItems: [],
  isOpen: false,
  outsideHandler: null,
};

init();

function init() {
  initHeroMeta();
  mountScrollShortcuts();
  initFilters();
  initSearch();
  initResetButtons();
  initPreview();
  updateHeroStats();
  updateFilterChips();
  resetPreview();
  render();
  initAnimations();
  initFilterMenu();
  updateActiveSummary();
}

function enrichProjects(list) {
  return list.map((project, index) => {
    const stackKey = deriveStackKey(project);
    const focusKey = deriveFocusKey(project);
    const recency = computeRecencyWeight(project, index);
    const keywords = buildKeywords(project);
    const slug = deriveProjectSlug(project);
    return {
      ...project,
      _display: project.title ?? project.id,
      _slug: slug,
      _stackKey: stackKey,
      _focusKey: focusKey,
      _recencyWeight: recency,
      _index: index,
      _keywords: keywords,
      _collectionTitle: CATEGORY_MAP[project.category]?.title ?? project.category,
      _sourceUrl: buildSourceUrl(project.relativePath),
    };
  });
}

function initHeroMeta() {
  if (!elements.generatedAt) return;
  const generated = GENERATED_AT ? new Date(GENERATED_AT) : null;
  if (!generated || Number.isNaN(generated.valueOf())) {
    elements.generatedAt.textContent = "Auto-sync active";
    return;
  }
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  elements.generatedAt.textContent = `Inventory refreshed ${formatter.format(generated)}`;
}

function mountScrollShortcuts() {
  document
    .querySelectorAll("[data-scroll-to]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-scroll-to");
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }),
    );
}

function initFilters() {
  buildCategoryChips();
  buildStackChips();
  buildFocusChips();
}

function buildCategoryChips() {
  const container = elements.categoryFilter;
  if (!container) return;
  container.innerHTML = "";

  const allChip = createFilterChip({
    group: "category",
    id: "all",
    label: "All collections",
    onSelect: () => updateState({ category: "all" }),
  });
  container.appendChild(allChip);
  filterRefs.category.set("all", allChip);

  Object.entries(CATEGORY_MAP).forEach(([id, meta]) => {
    const chip = createFilterChip({
      group: "category",
      id,
      label: meta.title,
      onSelect: () => updateState({ category: id }),
    });
    container.appendChild(chip);
    filterRefs.category.set(id, chip);
  });
}

function buildStackChips() {
  const container = elements.stackFilter;
  if (!container) return;
  container.innerHTML = "";

  STACK_GROUPS.forEach((group) => {
    const chip = createFilterChip({
      group: "stack",
      id: group.id,
      label: group.label,
      onSelect: () => updateState({ stack: group.id }),
    });
    container.appendChild(chip);
    filterRefs.stack.set(group.id, chip);
  });
}

function buildFocusChips() {
  const container = elements.focusFilter;
  if (!container) return;
  container.innerHTML = "";

  FOCUS_GROUPS.forEach((group) => {
    const chip = createFilterChip({
      group: "focus",
      id: group.id,
      label: group.label,
      onSelect: () => updateState({ focus: group.id }),
    });
    container.appendChild(chip);
    filterRefs.focus.set(group.id, chip);
  });
}

function initSearch() {
  if (!elements.searchInput) return;
  const handler = debounce((event) => {
    updateState({ query: event.target.value.trim().toLowerCase() });
  }, 180);
  elements.searchInput.addEventListener("input", handler);
  if (elements.searchInput.form) {
    elements.searchInput.form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }
}

function initResetButtons() {
  elements.resetButtons.forEach((button) =>
    button.addEventListener("click", () => {
      resetFilters();
    }),
  );
}

function initPreview() {
  if (elements.previewClose) {
    elements.previewClose.addEventListener("click", () => resetPreview());
  }

  if (elements.previewDialog) {
    elements.previewDialog.addEventListener("cancel", () => closePreviewDialog());
  }
}

function updateHeroStats() {
  const total = projects.length;
  writeCount(elements.totalCount, total);
  writeCount(elements.totalInline, total);
  if (elements.menuTotalCount) {
    writeCount(elements.menuTotalCount, total);
  }
  writeCount(elements.categoryTotal, Math.max(FOCUS_GROUPS.length - 1, 0));
  Object.entries(CATEGORY_MAP).forEach(([id]) => {
    const count = projects.filter((project) => project.category === id).length;
    elements.categoryCounts.forEach((node) => {
      if (node.getAttribute("data-category-count") === id) {
        writeCount(node, count);
      }
    });
  });
}

function updateFilterChips() {
  applyActiveState(filterRefs.category, state.category);
  applyActiveState(filterRefs.stack, state.stack);
  applyActiveState(filterRefs.focus, state.focus);
  updateActiveSummary();
}

function render() {
  const visible = computeVisibleProjects();
  updateVisibleCount(visible.length);
  renderProjects(visible);
  updateCounts();
}

function computeVisibleProjects() {
  const filtered = projects.filter((project) => filterProject(project));
  return [...filtered].sort(FEATURED_SORTER);
}

function filterProject(project, overrides = {}) {
  const category = overrides.category ?? state.category;
  const stack = overrides.stack ?? state.stack;
  const focus = overrides.focus ?? state.focus;
  const query = overrides.query ?? state.query;

  if (category !== "all" && project.category !== category) return false;
  if (stack !== "all" && project._stackKey !== stack) return false;
  if (focus !== "all" && project._focusKey !== focus) return false;

  if (query) {
    if (!project._keywords.includes(query)) return false;
  }

  return true;
}

function renderProjects(list) {
  const container = elements.projectList;
  if (!container) return;

  container.querySelectorAll("[data-project-card]").forEach((node) =>
    node.remove(),
  );

  const fragment = document.createDocumentFragment();
  const created = [];
  list.forEach((project) => {
    const card = buildProjectCard(project);
    created.push(card);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
  animateProjectCards(created);
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
}

function buildProjectCard(project) {
  const template = document.getElementById("project-card-template");
  const clone = template.content.firstElementChild.cloneNode(true);

  clone.dataset.projectCard = project.id;
  clone.dataset.stack = project._stackKey;
  clone.dataset.focus = project._focusKey;
  clone.dataset.category = project.category;

  const collection = clone.querySelector("[data-project-collection]");
  const stack = clone.querySelector("[data-project-stack]");
  const title = clone.querySelector("[data-project-title]");
  const slug = clone.querySelector("[data-project-slug]");
  const path = clone.querySelector("[data-project-path]");
  const openButton = clone.querySelector("[data-project-open]");
  const websiteButton = clone.querySelector("[data-project-website]");
  collection.textContent = project._collectionTitle;
  stack.textContent = stackLabel(project._stackKey);
  title.textContent = project._display;
  if (slug) {
    const displaySlug = project._slug
      ? project._slug.replace(/-/g, " ∙ ")
      : project.id;
    slug.textContent = displaySlug;
  }
  const relativePath = project.relativePath?.replace(/\/$/, "") ?? "";
  if (path) {
    path.textContent = relativePath ? decodeURIComponent(relativePath) : "";
  }

  if (openButton) {
    const sourceHref = project._sourceUrl ?? project.relativePath;
    openButton.href = sourceHref;
    openButton.setAttribute("title", `Open ${project._display} source`);
  }

  if (websiteButton) {
    const [labelNode] = websiteButton.querySelectorAll("span");
    let previewHref = project.previewUrl ?? null;
    if (!previewHref && project._stackKey === "vanilla") {
      const trimmed = project.relativePath?.replace(/\/$/, "");
      if (trimmed) {
        previewHref = `${trimmed}/index.html`;
      }
    }
    if (previewHref) {
      websiteButton.href = previewHref;
      websiteButton.removeAttribute("aria-disabled");
      websiteButton.removeAttribute("tabindex");
      websiteButton.removeAttribute("title");
      if (labelNode) labelNode.textContent = "Open website";
    } else {
      websiteButton.removeAttribute("href");
      websiteButton.setAttribute("aria-disabled", "true");
      websiteButton.setAttribute("tabindex", "-1");
      websiteButton.setAttribute("title", "Preview not available yet");
      if (labelNode) labelNode.textContent = "Preview unavailable";
    }
  }

  const hoverAnimation = gsap.to(clone, {
    duration: 0.45,
    y: -6,
    scale: 1.01,
    boxShadow: "0 36px 80px rgba(10, 12, 28, 0.45)",
    borderColor: "rgba(108, 249, 203, 0.45)",
    ease: "power3.out",
    paused: true,
  });

  clone.addEventListener("mouseenter", () => {
    presentPreview(project);
    hoverAnimation.play();
  });
  clone.addEventListener("mouseleave", () => {
    hoverAnimation.reverse();
  });
  clone.addEventListener("focusin", () => {
    presentPreview(project);
    hoverAnimation.play();
  });
  clone.addEventListener("focusout", () => {
    hoverAnimation.reverse();
  });

  return clone;
}

function presentPreview(project, { fromDialog = false } = {}) {
  if (!project) return;
  currentPreviewId = project.id;
  updatePreviewPanel(project);
  if (fromDialog) {
    openPreviewDialog(project);
  }
}

function updatePreviewPanel(project) {
  if (!elements.previewPanel) return;
  elements.previewTitle.textContent = project._display;

  if (project.previewUrl) {
    elements.previewInstructions.setAttribute("hidden", "");
    elements.previewFrame.removeAttribute("hidden");
    if (elements.previewFrame.src !== project.previewUrl) {
      elements.previewFrame.src = project.previewUrl;
    }
  } else {
    elements.previewFrame.setAttribute("hidden", "");
    elements.previewFrame.removeAttribute("src");
    elements.previewInstructions.innerHTML = buildPreviewFallback(project);
    elements.previewInstructions.removeAttribute("hidden");
  }

  animatePreviewSwap(project);
}

function openPreviewDialog(project) {
  const dialog = elements.previewDialog;
  if (!dialog) return;
  const content = dialog.querySelector(".preview-dialog__content");
  content.innerHTML = "";

  const title = document.createElement("h3");
  title.textContent = project._display;
  title.className = "preview-dialog__title";

  content.appendChild(title);

  if (project.previewUrl) {
    const frame = document.createElement("iframe");
    frame.className = "preview-dialog__frame";
    frame.loading = "lazy";
    frame.title = `${project._display} preview`;
    frame.sandbox = "allow-scripts allow-same-origin";
    frame.src = project.previewUrl;
    frame.style.width = "100%";
    frame.style.borderRadius = "18px";
    frame.style.border = "1px solid rgba(255,255,255,0.14)";
    frame.style.aspectRatio = "16 / 9";
    content.appendChild(frame);
  } else {
    const fallback = document.createElement("div");
    fallback.className = "preview-dialog__instructions";
    fallback.innerHTML = buildPreviewFallback(project);
    content.appendChild(fallback);
  }

  dialog.showModal();
  document.documentElement.setAttribute("data-mobile-preview-active", "true");
  const inner = dialog.querySelector(".preview-dialog__inner");
  if (inner) {
    gsap.fromTo(
      inner,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );
  }
}

function closePreviewDialog() {
  const dialog = elements.previewDialog;
  if (!dialog || !dialog.open) return;
  dialog.close();
  document.documentElement.removeAttribute("data-mobile-preview-active");
}

function resetPreview() {
  currentPreviewId = null;
  if (elements.previewFrame) {
    elements.previewFrame.removeAttribute("src");
    elements.previewFrame.setAttribute("hidden", "");
  }
  if (elements.previewInstructions) {
    elements.previewInstructions.textContent = "Hover a project card for a live preview";
    elements.previewInstructions.removeAttribute("hidden");
  }
  if (elements.previewTitle) {
    elements.previewTitle.textContent = "Hover a project to inspect details";
  }
  if (elements.previewPanel) {
    gsap.fromTo(
      elements.previewPanel,
      { opacity: 0.85 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
    );
  }
  closePreviewDialog();
}

function updateCounts() {
  updateFilterCountGroup("category", filterRefs.category, computeCounts({ dimension: "category" }));
  updateFilterCountGroup("stack", filterRefs.stack, computeCounts({ dimension: "stack" }));
  updateFilterCountGroup("focus", filterRefs.focus, computeCounts({ dimension: "focus" }));
}

function computeCounts({ dimension }) {
  const counts = new Map();
  const overrides = {};
  switch (dimension) {
    case "category":
      overrides.category = "all";
      break;
    case "stack":
      overrides.stack = "all";
      break;
    case "focus":
      overrides.focus = "all";
      break;
    default:
      break;
  }

  projects.forEach((project) => {
    if (!filterProject(project, overrides)) return;
    let key;
    switch (dimension) {
      case "category":
        key = project.category;
        break;
      case "stack":
        key = project._stackKey;
        break;
      case "focus":
        key = project._focusKey;
        break;
      default:
        break;
    }
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  const total = projects.filter((project) => filterProject(project, overrides)).length;
  counts.set("all", total);
  return counts;
}

function updateFilterCountGroup(dimension, refMap, counts) {
  refMap.forEach((chip, key) => {
    const value = counts.get(key) ?? 0;
    const label = chip.dataset.label;
    const countNode = chip.querySelector(".chip__count");
    writeCount(countNode, value);
    chip.setAttribute("aria-label", `${label} (${value} matches)`);
  });
  const indicator = document.querySelector(`[data-filter-count="${dimension}"]`);
  if (indicator) {
    const activeCount = state[dimension] === "all" ? 0 : 1;
    indicator.textContent = activeCount ? `${activeCount} active` : "";
    if (activeCount) {
      gsap.fromTo(
        indicator,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
    } else {
      indicator.style.opacity = "";
      indicator.style.transform = "";
    }
  }
}

function updateVisibleCount(count) {
  writeCount(elements.visibleCount, count);
  if (elements.menuVisibleCount && elements.menuVisibleCount !== elements.visibleCount) {
    writeCount(elements.menuVisibleCount, count);
  }
}

function applyActiveState(map, activeId) {
  map.forEach((chip, id) => {
    const isActive = id === activeId;
    chip.classList.toggle("chip--active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
    gsap.to(chip, {
      duration: 0.35,
      y: isActive ? -4 : 0,
      scale: isActive ? 1.03 : 1,
      ease: "power3.out",
    });
  });
}

function updateState(partial) {
  let mutated = false;
  Object.entries(partial).forEach(([key, value]) => {
    const current = state[key];
    if (current !== value) {
      state[key] = value;
      mutated = true;
    }
  });
  if (!mutated) return;
  updateFilterChips();
  render();
  updateActiveSummary();
}

function resetFilters() {
  state.category = "all";
  state.stack = "all";
  state.focus = "all";
  state.query = "";

  if (elements.searchInput) {
    elements.searchInput.value = "";
  }
  resetPreview();
  updateFilterChips();
  render();
  updateActiveSummary();
}

function writeCount(node, value) {
  if (!node) return;
  const formatted = formatCount(value);
  if (node.textContent === formatted) {
    return;
  }
  node.textContent = formatted;

  const menuHidden =
    filterMenuController.root &&
    filterMenuController.root.contains(node) &&
    (filterMenuController.root.getAttribute("aria-hidden") !== "false" ||
      !filterMenuController.isOpen);

  if (menuHidden || typeof gsap === "undefined") {
    return;
  }

  gsap.fromTo(
    node,
    { y: 8, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
  );
}

function animateProjectCards(nodes) {
  if (!nodes || !nodes.length) return;
  const items = Array.from(nodes);
  const subset = items.slice(0, 36);
  gsap.fromTo(
    subset,
    { opacity: 0, y: 24, rotateX: -6 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.03,
    },
  );
  if (items.length > subset.length) {
    gsap.set(items.slice(subset.length), { opacity: 1, y: 0, rotateX: 0 });
  }
}

function animatePreviewSwap() {
  if (!elements.previewPanel) return;
  const active =
    elements.previewFrame && !elements.previewFrame.hasAttribute("hidden")
      ? elements.previewFrame
      : elements.previewInstructions;
  if (active) {
    gsap.fromTo(
      active,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  }
}

function initAnimations() {
  if (animationsInitialized) {
    ScrollTrigger.refresh();
    return;
  }
  animationsInitialized = true;

  animateHeroIntro();
  setupHeroScrollEffects();
  setupFilterRevealAnimations();
}

function animateHeroIntro() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const glyphs = hero.querySelectorAll(".hero__glyph");
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (glyphs.length) {
    timeline.from(glyphs, {
      opacity: 0,
      yPercent: 110,
      duration: 0.6,
      stagger: 0.015,
    });
  }

  timeline
    .from(
      ".hero__body",
      { opacity: 0, y: 28, duration: 0.65 },
      glyphs.length ? "-=0.35" : 0,
    )
    .from(
      ".hero__actions .pill",
      { opacity: 0, y: 20, duration: 0.45, stagger: 0.08 },
      "-=0.3",
    )
    .from(
      ".hero-card",
      {
        opacity: 0,
        y: 60,
        rotateX: -8,
        scale: 0.92,
        duration: 0.75,
        stagger: 0.1,
      },
      "-=0.35",
    );
}

function setupHeroScrollEffects() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  if (window.matchMedia("(max-width: 900px)").matches) return;

  const cards = gsap.utils.toArray(".hero-card");
  if (!cards.length) return;

  gsap.set(cards, { transformOrigin: "center top" });

  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom+=140 top",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      cards.forEach((card, index) => {
        const offset = index - (cards.length - 1) / 2;
        const y = progress * 160 * (index + 1);
        const x = offset * progress * 90;
        const rotation = offset * progress * 9;
        const scale = 1 - progress * 0.14;
        gsap.set(card, { y, x, rotation, scale });
      });
    },
  });
}

function setupFilterRevealAnimations() {
  const groups = gsap.utils.toArray(
    ".filters__group, .filters__search, .filters__sort, .filters__callout",
  );
  if (!groups.length) return;

  groups.forEach((node, index) => {
    gsap.set(node, { opacity: 0, y: 32 });
    ScrollTrigger.create({
      trigger: node,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(node, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          delay: index * 0.05,
        });
        const chips = node.querySelectorAll(".chip");
        if (chips.length) {
          gsap.fromTo(
            chips,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.04,
              overwrite: "auto",
            },
          );
        }
      },
    });
  });
}

function formatCount(value) {
  if (value >= 1000) {
    return `${Math.round((value / 1000) * 10) / 10}K`;
  }
  return value.toString().padStart(2, "0");
}

function stackLabel(id) {
  return STACK_GROUPS.find((group) => group.id === id)?.label ?? "Mixed stack";
}

function buildKeywords(project) {
  const slug = deriveProjectSlug(project);
  const chunk = [
    project.id,
    project.title,
    project.relativePath,
    slug,
    ...((project.tags ?? []).map((tag) => `#${tag}`)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return chunk;
}

function deriveStackKey(project) {
  const tags = new Set((project.tags ?? []).map((tag) => tag.toLowerCase()));
  const path = project.relativePath?.toLowerCase() ?? "";
  const descriptor = `${project.title ?? ""} ${project.id ?? ""}`.toLowerCase();

  if (tags.has("nextjs")) return "next";
  if (tags.has("react") || tags.has("vite") || tags.has("preact")) return "react";

  if (path.includes("next")) return "next";
  if (path.includes("react") || path.includes("vite")) return "react";

  if (descriptor.includes("next")) return "next";
  if (descriptor.includes("react") || descriptor.includes("vite")) return "react";

  return "vanilla";
}

function deriveFocusKey(project) {
  for (const definition of FOCUS_DEFINITIONS) {
    if (definition.matcher(project)) {
      return definition.id;
    }
  }
  return "misc";
}

function computeRecencyWeight(project, index) {
  const path = project.relativePath ?? "";
  const numbers = path.match(/(\d{2,4})/g);
  if (numbers && numbers.length) {
    const last = Number(numbers[numbers.length - 1]);
    if (!Number.isNaN(last)) {
      return last + index / 1000;
    }
  }
  return project.category === "templates"
    ? 10000 + (PROJECTS.length - index)
    : PROJECTS.length - index;
}

function buildPreviewFallback(project) {
  const stack = project._stackKey ?? deriveStackKey(project);
  if (stack === "vanilla") {
    return `
      <p>This project ships as static HTML. Open the source folder to explore the markup and styles.</p>
    `;
  }

  const defaultUrl = stack === "next" ? "http://localhost:3000" : stack === "react" ? "http://localhost:5173" : "http://localhost:3000";
  return `
    <p>This project needs its dev server running locally before a preview is available.</p>
    <p>Typical local URL: <strong>${defaultUrl}</strong></p>
  `;
}

function createFilterChip({ group, id, label, onSelect, toggle = false }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip";
  button.dataset.value = id;
  button.dataset.group = group;
  button.dataset.label = label;
  button.setAttribute("aria-pressed", "false");

  const labelNode = document.createElement("span");
  labelNode.className = "chip__label";
  labelNode.textContent = label;

  const countNode = document.createElement("span");
  countNode.className = "chip__count";
  countNode.textContent = "00";

  button.append(labelNode, countNode);

  button.addEventListener("click", () => {
    if (toggle) {
      onSelect();
    } else {
      if (state[group] === id) return;
      onSelect();
    }
  });
  return button;
}

function matchesKeywords(project, pattern) {
  if (!project || !project._keywords) return false;
  return pattern.test(project._keywords);
}

function hasAnyTag(project, targets) {
  if (!project.tags || !project.tags.length) return false;
  const tags = project.tags.map((tag) => tag.toLowerCase());
  return targets.some((target) => tags.includes(target));
}

function debounce(fn, wait = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

function buildFeaturedSorter() {
  const categoryPriority = new Map([
    ["templates", 0],
    ["showcase", 1],
  ]);
  const focusPriority = new Map(
    FOCUS_GROUPS.map((group, index) => [group.id, index]),
  );
  return (a, b) => {
    const catDiff =
      (categoryPriority.get(a.category) ?? 2) -
      (categoryPriority.get(b.category) ?? 2);
    if (catDiff !== 0) return catDiff;
    const focusDiff =
      (focusPriority.get(a._focusKey) ?? 10) -
      (focusPriority.get(b._focusKey) ?? 10);
    if (focusDiff !== 0) return focusDiff;
    return a._index - b._index;
  };
}

function deriveProjectSlug(project) {
  if (project.slug) return project.slug;

  if (project.id && /[a-z]/i.test(project.id)) {
    return slugifyValue(project.id);
  }

  if (project.relativePath) {
    const segments = project.relativePath.split("/").filter(Boolean);
    const folder = segments[segments.length - 1];
    if (folder) {
      return slugifyValue(decodeURIComponent(folder));
    }
  }

  if (project.title) {
    return slugifyValue(project.title);
  }

  return "";
}

function slugifyValue(input) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function buildSourceUrl(relativePath) {
  if (!relativePath) return null;
  const trimmed = relativePath.replace(/\/$/, "");
  return `${REPOSITORY_ROOT}${trimmed}`;
}

function isPreviewOnlyLayout() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function updateActiveSummary() {
  const parts = [];
  if (state.category !== "all") {
    const label = filterRefs.category.get(state.category)?.dataset.label ?? state.category;
    parts.push(label);
  }
  if (state.stack !== "all") {
    const label = filterRefs.stack.get(state.stack)?.dataset.label ?? state.stack;
    parts.push(label);
  }
  if (state.focus !== "all") {
    const label = filterRefs.focus.get(state.focus)?.dataset.label ?? state.focus;
    parts.push(label);
  }
  if (state.query) {
    parts.push(`Search: “${state.query}”`);
  }

  const summaryText = parts.length ? parts.join(" · ") : "No filters applied";
  if (elements.activeSummary) {
    elements.activeSummary.textContent = summaryText;
  }
  if (elements.menuActiveSummary) {
    elements.menuActiveSummary.textContent = summaryText;
  }

  const activeTotal = parts.length;
  if (elements.activeTotal) {
    elements.activeTotal.textContent = activeTotal.toString();
  }
  if (elements.menuActiveTotal) {
    elements.menuActiveTotal.textContent = activeTotal.toString();
  }
}

function initFilterMenu() {
  const root = elements.filterMenuRoot;
  if (!root) return;
  const shell = root.querySelector("[data-filter-menu-shell]");
  if (!shell) return;

  const toggles = Array.from(document.querySelectorAll("[data-filter-menu-toggle]"));
  const closeButtons = Array.from(root.querySelectorAll("[data-filter-menu-close]"));
  const menuItems = Array.from(root.querySelectorAll("[data-menu-animate]"));

  filterMenuController.root = root;
  filterMenuController.shell = shell;
  filterMenuController.timeline = null;
  filterMenuController.toggles = toggles;
  filterMenuController.closeButtons = closeButtons;
  filterMenuController.menuItems = menuItems;

  root.setAttribute("aria-hidden", "true");

  gsap.set(shell, {
    clipPath: "polygon(0 0, 0 120px, 65% 120px, 65% 0)",
  });
  gsap.set(menuItems, { y: 28, opacity: 0 });
  shell.style.pointerEvents = "none";

  const timeline = gsap.timeline({ paused: true });
  timeline
    .to(shell, {
      duration: 0.9,
      ease: "power3.inOut",
      width: "420px",
      clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
      onStart: () => {
        root.classList.add("filter-menu--animating");
        root.classList.add("filter-menu--open");
        shell.style.pointerEvents = "auto";
        setMenuExpanded(true);
        root.setAttribute("aria-hidden", "false");
      },
    })
    .to(
      menuItems,
      {
        duration: 0.7,
        ease: "power3.out",
        y: 0,
        opacity: 1,
        stagger: 0.05,
      },
      "-=0.55",
    );

  timeline.eventCallback("onComplete", () => {
    filterMenuController.isOpen = true;
    root.classList.remove("filter-menu--animating");
  });

  timeline.eventCallback("onReverseComplete", () => {
    filterMenuController.isOpen = false;
    root.classList.remove("filter-menu--animating");
    root.classList.remove("filter-menu--open");
    shell.style.pointerEvents = "none";
    gsap.set(menuItems, { y: 28, opacity: 0 });
    gsap.set(shell, { width: "250px" });
    setMenuExpanded(false);
    root.setAttribute("aria-hidden", "true");
  });

  filterMenuController.timeline = timeline;

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      if (filterMenuController.timeline?.isActive()) return;
      if (filterMenuController.isOpen) {
        closeFilterMenu();
      } else {
        openFilterMenu();
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (filterMenuController.timeline?.isActive()) return;
      closeFilterMenu();
    });
  });

  const handlePointerDown = (event) => {
    if (!filterMenuController.isOpen) return;
    if (filterMenuController.timeline?.isActive()) return;
    const target = event.target;
    if (!target) return;
    const clickedInsideMenu = filterMenuController.shell.contains(target);
    const clickedToggle = filterMenuController.toggles.some((toggle) => toggle.contains(target));
    if (!clickedInsideMenu && !clickedToggle) {
      closeFilterMenu();
    }
  };

  if (filterMenuController.outsideHandler) {
    document.removeEventListener("pointerdown", filterMenuController.outsideHandler);
  }
  filterMenuController.outsideHandler = handlePointerDown;
  document.addEventListener("pointerdown", handlePointerDown);
}

function openFilterMenu() {
  if (!filterMenuController.timeline) return;
  gsap.set(filterMenuController.menuItems, { y: 40, opacity: 0 });
  filterMenuController.timeline.timeScale(1).play();
}

function closeFilterMenu() {
  if (!filterMenuController.timeline) return;
  filterMenuController.timeline.timeScale(1.1).reverse();
}

function setMenuExpanded(expanded) {
  filterMenuController.toggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", String(expanded));
  });
}

window.addEventListener("resize", () => {
  if (!isPreviewOnlyLayout()) {
    closePreviewDialog();
  }
  if (animationsInitialized) {
    ScrollTrigger.refresh();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePreviewDialog();
    closeFilterMenu();
  }
});
