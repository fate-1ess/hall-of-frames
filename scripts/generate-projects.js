#!/usr/bin/env node
/*
 * Auto-generates the projects.js inventory by scanning the Showcase and Templates folders.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'projects.js');
const JSON_OUTPUT_FILE = path.join(ROOT_DIR, 'projects.json');
const STATIC_ASSETS_DIR = path.join(ROOT_DIR, 'index-assets');

const CATEGORY_DEFINITIONS = [
  {
    key: 'showcase',
    dir: 'Showcase',
    title: 'Showcase',
    description: 'Experimental UI explorations, creative coding demos, and GSAP experiments.',
    defaultTags: ['html', 'css', 'javascript', 'animation'],
  },
  {
    key: 'templates',
    dir: 'Templates',
    title: 'Templates',
    description: 'Reusable monthly website templates and starter kits for client work.',
    defaultTags: ['html', 'css', 'template'],
  },
];

const KEYWORD_TAGS = [
  { tag: 'nextjs', keywords: ['next', 'nextjs'] },
  { tag: 'react', keywords: ['react'] },
  { tag: 'vite', keywords: ['vite'] },
  { tag: 'gsap', keywords: ['gsap', 'scrolltrigger'] },
  { tag: 'animation', keywords: ['animate', 'animation', 'motion', 'reveal'] },
  { tag: 'threejs', keywords: ['three', 'threejs', '3d'] },
  { tag: 'webgl', keywords: ['webgl', 'glsl', 'shader', 'shaders', 'raymarch'] },
  { tag: 'canvas', keywords: ['canvas'] },
  { tag: 'svg', keywords: ['svg'] },
  { tag: 'lottie', keywords: ['lottie'] },
  { tag: 'audio', keywords: ['audio'] },
  { tag: 'video', keywords: ['video'] },
  { tag: 'text', keywords: ['text', 'typography', 'headline', 'glyph', 'letters', 'typewriter'] },
  { tag: 'navigation', keywords: ['menu', 'nav', 'navigation', 'navbar', 'sidebar', 'drawer', 'mega menu'] },
  { tag: 'scroll', keywords: ['scroll', 'scrolling', 'parallax', 'locomotive', 'sticky', 'pin'] },
  { tag: 'hover', keywords: ['hover', 'cursor', 'pointer', 'magnetic', 'magnet', 'distortion'] },
  { tag: 'landing', keywords: ['landing', 'homepage', 'hero', 'campaign', 'agency', 'portfolio', 'studio'] },
  { tag: 'transition', keywords: ['transition', 'page transition', 'view transition', 'swup', 'barba'] },
  { tag: 'preloader', keywords: ['preload', 'preloader', 'loader', 'loading', 'progress'] },
  { tag: 'slider', keywords: ['slider', 'carousel', 'gallery', 'slideshow', 'marquee', 'trail'] },
];

const DEFAULT_LOCAL_URLS = {
  nextjs: 'http://localhost:3000',
  vite: 'http://localhost:5173',
  react: 'http://localhost:3000',
  svelte: 'http://localhost:5173',
  vue: 'http://localhost:5173',
  nuxt: 'http://localhost:3000',
};

const MONTH_PATTERNS = [
  { pattern: 'SEPTEMBER', value: 'september' },
  { pattern: 'SEPT', value: 'september' },
  { pattern: 'AUGUST', value: 'august' },
  { pattern: 'OCTOBER', value: 'october' },
  { pattern: 'NOVEMBER', value: 'november' },
  { pattern: 'DECEMBER', value: 'december' },
  { pattern: 'JANUARY', value: 'january' },
  { pattern: 'FEBRUARY', value: 'february' },
  { pattern: 'MARCH', value: 'march' },
  { pattern: 'APRIL', value: 'april' },
  { pattern: 'MAY', value: 'may' },
  { pattern: 'JUNE', value: 'june' },
  { pattern: 'JULY', value: 'july' },
  { pattern: 'SEP', value: 'september' },
  { pattern: 'AUG', value: 'august' },
  { pattern: 'OCT', value: 'october' },
  { pattern: 'NOV', value: 'november' },
  { pattern: 'DEC', value: 'december' },
  { pattern: 'JAN', value: 'january' },
  { pattern: 'FEB', value: 'february' },
  { pattern: 'MAR', value: 'march' },
  { pattern: 'APR', value: 'april' },
  { pattern: 'JUN', value: 'june' },
  { pattern: 'JUL', value: 'july' },
];

main();

function main() {
  const categories = {};
  const projects = [];

  CATEGORY_DEFINITIONS.forEach((category) => {
    const categoryPath = path.join(ROOT_DIR, category.dir);
    categories[category.key] = {
      title: category.title,
      basePath: category.dir,
      description: category.description,
    };

    const subProjects = readDirectories(categoryPath);
    subProjects.forEach((folderName) => {
      const absPath = path.join(categoryPath, folderName);
      const legacyId = `${category.key}-${slugify(folderName)}`;
      const projectId = deriveProjectId(category.key, folderName);
      const relativePath = `${category.dir}/${encodePath(folderName)}/`;
      const displayName = prettifyName(folderName);
      const baseTags = deriveTags(folderName, absPath, category.defaultTags);
      const pkgInfo = readPackageMetadata(absPath);
      const framework = detectFramework(pkgInfo);
      const tags = new Set(baseTags);
      framework?.tags.forEach((tag) => tags.add(tag));
      extractKeywords(displayName).forEach((token) => tags.add(token));
      extractKeywords(folderName).forEach((token) => tags.add(token));

  const staticPreview = resolveStaticPreview(projectId) ?? resolveStaticPreview(legacyId);
      const directPreview = framework ? null : resolveSourcePreview(relativePath, absPath);
      const previewUrl = staticPreview ?? directPreview;
      if (previewUrl) {
        tags.add('static');
      }

      const projectRecord = {
        id: projectId,
        title: displayName,
        category: category.key,
        relativePath,
        previewUrl,
        tags: Array.from(tags).sort(),
        requiresServer: Boolean(framework),
      };

      if (framework) {
        projectRecord.framework = framework.name;
      }

      projects.push(projectRecord);
    });
  });

  const uniqueTags = Array.from(
    new Set(projects.flatMap((project) => project.tags)),
  ).sort();

  const generatedAt = new Date().toISOString();

  const fileContents = `// Auto-generated on ${generatedAt} by scripts/generate-projects.js\n` +
    `export const CATEGORY_MAP = ${toJs(categories)};\n\n` +
    `export const PROJECTS = ${toJs(projects)};\n\n` +
    `export const TECHNOLOGY_TAGS = ${toJs(uniqueTags)};\n\n` +
    `export const GENERATED_AT = ${toJs(generatedAt)};\n\n` +
    'export default { CATEGORY_MAP, PROJECTS, TECHNOLOGY_TAGS, GENERATED_AT };\n';

  fs.writeFileSync(OUTPUT_FILE, fileContents, 'utf8');
  fs.writeFileSync(
    JSON_OUTPUT_FILE,
    JSON.stringify(
      {
        CATEGORY_MAP: categories,
        PROJECTS: projects,
        TECHNOLOGY_TAGS: uniqueTags,
        GENERATED_AT: generatedAt,
      },
      null,
      2,
    ),
    'utf8',
  );
  console.log(`Generated ${projects.length} projects with ${uniqueTags.length} tags.`);
  console.log(`Output \u2192 ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
  console.log(`Output \u2192 ${path.relative(ROOT_DIR, JSON_OUTPUT_FILE)}`);
}

function resolveStaticPreview(projectId) {
  const targetDir = path.join(STATIC_ASSETS_DIR, projectId);
  if (!fs.existsSync(targetDir)) return null;
  const indexFile = path.join(targetDir, 'index.html');
  if (!fs.existsSync(indexFile)) return null;
  return path.posix.join('index-assets', projectId, 'index.html');
}

function resolveSourcePreview(relativePath, absPath) {
  const indexFile = path.join(absPath, 'index.html');
  if (!fs.existsSync(indexFile)) return null;
  const trimmed = relativePath.replace(/\\/g, '/').replace(/\/$/, '');
  return `${trimmed}/index.html`;
}

function readDirectories(root) {
  try {
    return fs
      .readdirSync(root, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }));
  } catch (error) {
    console.error(`Failed to read directories in ${root}`);
    throw error;
  }
}

function deriveTags(name, absPath, defaults = []) {
  const normalized = name.toLowerCase();
  const tags = new Set(defaults);

  tags.add('project');

  KEYWORD_TAGS.forEach(({ tag, keywords }) => {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      tags.add(tag);
      if (tag === 'nextjs') {
        tags.add('react');
        tags.add('javascript');
      }
      if (tag === 'threejs') {
        tags.add('webgl');
      }
      if (tag === 'gsap') {
        tags.add('animation');
        tags.add('javascript');
      }
    }
  });

  if (/react/.test(normalized)) {
    tags.add('react');
    tags.add('javascript');
  }

  if (/\b(ts|typescript)\b/.test(normalized)) {
    tags.add('typescript');
  }

  if (containsFileWithExtension(absPath, ['.tsx', '.ts'])) {
    tags.add('typescript');
  }

  if (containsFileWithExtension(absPath, ['.js', '.jsx', '.ts', '.tsx'])) {
    tags.add('javascript');
  }

  if (containsFileWithExtension(absPath, ['.json'])) {
    tags.add('json');
  }

  if (hasPackageDependency(absPath, ['next'])) {
    tags.add('nextjs');
    tags.add('react');
    tags.add('javascript');
  }

  if (hasPackageDependency(absPath, ['react'])) {
    tags.add('react');
    tags.add('javascript');
  }

  if (hasPackageDependency(absPath, ['gsap'])) {
    tags.add('gsap');
    tags.add('animation');
    tags.add('javascript');
  }

  if (containsFileWithExtension(absPath, ['.glsl', '.frag', '.vert'])) {
    tags.add('shader');
    tags.add('webgl');
  }

  if (containsFileWithExtension(absPath, ['.mp3', '.wav', '.ogg'])) {
    tags.add('audio');
  }

  if (containsFileWithExtension(absPath, ['.mp4', '.webm'])) {
    tags.add('video');
  }

  return Array.from(tags);
}

function prettifyName(rawName) {
  if (!rawName) return rawName;

  const name = rawName
    .replace(/^\d+(?:[).\-\s_]+)/, '')
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, ' ')
    .trim();

  if (!name) return rawName.trim();

  return name
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function readPackageMetadata(dir) {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const manager = detectPackageManager(dir);
    const scripts = pkg.scripts ?? {};
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

    return { pkg, pkgPath, manager, scripts, dependencies };
  } catch (error) {
    console.warn(`Failed to parse package.json in ${dir}:`, error.message);
    return null;
  }
}

function detectPackageManager(dir) {
  if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(dir, 'bun.lockb'))) return 'bun';
  return fs.existsSync(path.join(dir, 'package-lock.json')) ? 'npm' : 'npm';
}

function buildCommand(manager, script) {
  switch (manager) {
    case 'pnpm':
      return `pnpm ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    case 'bun':
      return `bun run ${script}`;
    case 'npm':
    default:
      return `npm run ${script}`;
  }
}

function detectFramework(pkgInfo) {
  if (!pkgInfo) return null;

  const { dependencies = {}, scripts, manager } = pkgInfo;
  const depNames = Object.keys(dependencies).map((name) => name.toLowerCase());

  const register = (name, key, additional = {}) => ({
    name,
    identifier: key,
    requiresServer: true,
    devCommand: inferDevCommand(manager, scripts),
    localUrl: DEFAULT_LOCAL_URLS[key] ?? null,
    tags: additional.tags ?? [],
  });

  if (dependencies.next) {
    const info = register('Next.js', 'nextjs', {
      tags: ['nextjs', 'react', 'javascript'],
    });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'dev');
    info.localUrl = info.localUrl ?? DEFAULT_LOCAL_URLS.nextjs;
    return info;
  }

  if (dependencies.react) {
    const usesVite =
      dependencies.vite ||
      dependencies['@vitejs/plugin-react'] ||
      (scripts?.dev ?? '').toLowerCase().includes('vite');

    const key = usesVite ? 'vite' : 'react';
    const name = usesVite ? 'React + Vite' : 'React';
    const info = register(name, key, {
      tags: usesVite ? ['react', 'javascript', 'vite'] : ['react', 'javascript'],
    });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'dev');
    info.localUrl = info.localUrl ?? DEFAULT_LOCAL_URLS[key];
    return info;
  }

  if (dependencies.gatsby) {
    const info = register('Gatsby', 'react', { tags: ['react', 'javascript'] });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'develop');
    info.localUrl = info.localUrl ?? 'http://localhost:8000';
    return info;
  }

  if (depNames.some((name) => name.includes('svelte'))) {
    const info = register('Svelte', 'svelte', { tags: ['svelte', 'javascript'] });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'dev');
    info.localUrl = info.localUrl ?? 'http://localhost:5173';
    return info;
  }

  if (depNames.some((name) => name.includes('nuxt'))) {
    const info = register('Nuxt', 'nuxt', { tags: ['nuxt', 'vue', 'javascript'] });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'dev');
    info.localUrl = info.localUrl ?? 'http://localhost:3000';
    return info;
  }

  if (dependencies.vue || depNames.some((name) => name.includes('vue'))) {
    const info = register('Vue', 'vue', { tags: ['vue', 'javascript'] });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'dev');
    info.localUrl = info.localUrl ?? 'http://localhost:5173';
    return info;
  }

  if (
    dependencies.vite ||
    depNames.includes('vite') ||
    (scripts?.dev ?? '').toLowerCase().includes('vite')
  ) {
    const info = register('Vite', 'vite', { tags: ['javascript', 'vite'] });
    info.devCommand = info.devCommand ?? buildCommand(manager, 'dev');
    info.localUrl = info.localUrl ?? DEFAULT_LOCAL_URLS.vite;
    return info;
  }

  return null;
}

function inferDevCommand(manager, scripts = {}) {
  if (scripts.dev) return buildCommand(manager, 'dev');
  if (scripts.start) return buildCommand(manager, 'start');
  if (scripts.serve) return buildCommand(manager, 'serve');
  return null;
}

function containsFileWithExtension(dir, extensions, depth = 2) {
  if (depth < 0) return false;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    return false;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        return true;
      }
    } else if (entry.isDirectory()) {
      if (containsFileWithExtension(path.join(dir, entry.name), extensions, depth - 1)) {
        return true;
      }
    }
  }

  return false;
}

function hasPackageDependency(dir, dependencies) {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const depEntries = { ...pkg.dependencies, ...pkg.devDependencies }; // eslint-disable-line
    return dependencies.some((dep) => depEntries && depEntries[dep]);
  } catch (error) {
    console.warn(`Failed to parse package.json in ${dir}:`, error.message);
    return false;
  }
}

function deriveProjectId(categoryKey, folderName) {
  if (categoryKey === 'showcase') {
    const numeric = folderName.match(/^\s*(\d{1,4})/);
    if (numeric && numeric[1]) {
      return numeric[1].padStart(2, '0');
    }
  }

  if (categoryKey === 'templates') {
    const upper = folderName.toUpperCase();
    const compact = upper.replace(/[^A-Z0-9]/g, '');
    const tailMatch = compact.match(/([A-Z]+)(\d{4})$/);
    if (tailMatch) {
      const token = tailMatch[1];
      const year = tailMatch[2];
      for (const { pattern, value } of MONTH_PATTERNS) {
        if (token.endsWith(pattern)) {
          return `${value}${year}`;
        }
      }
    }
  }

  return slugify(folderName);
}

function extractKeywords(value) {
  if (!value) return [];
  const separated = value
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/([0-9])([a-z])/gi, '$1 $2')
    .replace(/[_/.-]+/g, ' ');
  return separated
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !/^\d+$/.test(token));
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function encodePath(input) {
  return input
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function toJs(value) {
  return JSON.stringify(value, null, 2);
}
