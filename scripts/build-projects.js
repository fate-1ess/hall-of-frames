#!/usr/bin/env node
/**
 * Builds framework-driven projects (Next.js, React/Vite, etc.) into static assets
 * that can be served alongside the CODEGRID directory.
 *
 * Usage examples:
 *   node scripts/build-projects.js
 *   node scripts/build-projects.js --project showcase-128-cg-next-navigation
 *   node scripts/build-projects.js --project showcase-128-cg-next-navigation --force-install
 *   node scripts/build-projects.js --clean
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'projects.json');
const OUTPUT_ROOT = path.join(ROOT_DIR, 'index-assets');
const TEXT_EXTENSIONS = new Set([
  '.html',
  '.htm',
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.json',
  '.txt',
  '.svg',
  '.xml',
  '.map',
]);

main();

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.clean) {
    cleanOutput();
    console.log('Cleaned index-assets directory.');
    return;
  }

  const dataset = loadProjects();
  const projects = selectProjects(dataset.PROJECTS, options);
  if (projects.length === 0) {
    console.log('Nothing to build. Add a framework project or adjust your filters.');
    return;
  }

  ensureDir(OUTPUT_ROOT);

  const results = { built: [], skipped: [], failed: [] };

  projects.forEach((project) => {
    try {
      const outcome = buildProject(project, options);
      results[outcome.status].push({ project, details: outcome.details });
    } catch (error) {
      results.failed.push({ project, details: error.message });
      console.error(`\n✖ Failed to build ${project.id}: ${error.message}`);
    }
  });

  console.log('\nBuild summary:');
  console.log(`  Built   → ${results.built.length}`);
  console.log(`  Skipped → ${results.skipped.length}`);
  console.log(`  Failed  → ${results.failed.length}`);

  if (results.skipped.length) {
    console.log('\nProjects without static exports (skipped):');
    results.skipped.forEach(({ project, details }) => {
      console.log(`  • ${project.id} (${project.framework || 'Unknown'}) → ${details}`);
    });
  }

  if (results.failed.length) {
    console.log('\nProjects that failed to build:');
    results.failed.forEach(({ project, details }) => {
      console.log(`  • ${project.id} (${project.framework || 'Unknown'}) → ${details}`);
    });
    process.exitCode = 1;
  }

  regenerateInventory();
}

function parseArgs(args) {
  const options = {
    projectIds: new Set(),
    forceInstall: false,
    skipInstall: false,
    clean: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--project':
      case '--id':
        if (!args[i + 1]) throw new Error(`${arg} requires a value`);
        options.projectIds.add(args[i + 1]);
        i += 1;
        break;
      case '--force-install':
        options.forceInstall = true;
        break;
      case '--skip-install':
        options.skipInstall = true;
        break;
      case '--clean':
        options.clean = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function loadProjects() {
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error('Missing projects.json. Run "node scripts/generate-projects.js" first.');
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse projects.json: ${error.message}`);
  }
}

function selectProjects(projects, options) {
  const filtered = projects.filter((project) => {
    if (options.projectIds.size > 0 && !options.projectIds.has(project.id)) {
      return false;
    }
    // Only build projects that require a dev server (framework-based)
    return project.requiresServer || Boolean(project.framework);
  });

  if (filtered.length === 0 && options.projectIds.size > 0) {
    console.warn('No matching projects found for the provided ids.');
  }

  return filtered;
}

function buildProject(project, options) {
  const relativePath = decodeURIComponent(project.relativePath).replace(/[\\/]+$/, '');
  const projectDir = path.join(ROOT_DIR, relativePath);
  ensureExists(projectDir, `Project directory not found: ${projectDir}`);

  const pkgPath = path.join(projectDir, 'package.json');
  ensureExists(pkgPath, 'Cannot build a project without package.json');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const manager = detectPackageManager(projectDir);
  const scripts = pkg.scripts ?? {};

  if (!options.skipInstall && (options.forceInstall || !fs.existsSync(path.join(projectDir, 'node_modules')))) {
    installDependencies(manager, projectDir);
  }

  const framework = (project.framework || '').toLowerCase();
  if (framework.includes('next')) {
    return buildNextProject({ project, projectDir, manager, scripts });
  }

  if (framework.includes('react')) {
    return buildReactProject({ project, projectDir, manager, scripts });
  }

  if (framework.includes('vite')) {
    return buildViteProject({ project, projectDir, manager, scripts });
  }

  return { status: 'skipped', details: 'Unsupported framework for automated build' };
}

function buildNextProject({ project, projectDir, manager, scripts }) {
  const outputDir = path.join(projectDir, 'out');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  const basePathEnv = `/index-assets/${project.id}`;
  const env = {
    NEXT_BASE_PATH: basePathEnv,
    NEXT_ASSET_PREFIX: basePathEnv,
    NEXT_PUBLIC_BASE_PATH: basePathEnv,
    NEXT_PUBLIC_ASSET_PREFIX: basePathEnv,
  };

  const buildCommand = getScriptCommand(manager, scripts, 'build') ?? `${getRunner(manager)} next build`;
  runCommand(buildCommand, projectDir, `Building ${project.id}`, { env });

  let exported = fs.existsSync(outputDir);
  let exportSource = exported ? 'next build (output: "export")' : null;

  const exportCommand = getScriptCommand(manager, scripts, 'export');
  if (!exported && exportCommand) {
    const result = runCommand(exportCommand, projectDir, `Exporting ${project.id}`, {
      allowFailure: true,
      env,
    });
    if (result === 0 && fs.existsSync(outputDir)) {
      exported = true;
      exportSource = exportCommand;
    }
  }

  if (!exported) {
    const fallback = `${getRunner(manager)} next export`;
    const result = runCommand(fallback, projectDir, `Exporting ${project.id}`, {
      allowFailure: true,
      env,
    });
    if (result === 0 && fs.existsSync(outputDir)) {
      exported = true;
      exportSource = fallback;
    }
  }

  if (!exported) {
    return {
      status: 'skipped',
      details: 'No static export found (enable output: "export" or add an export script)',
    };
  }

  const destination = copyBuildToAssets(project.id, outputDir);
  applyBasePathRewrite(destination, project.id);
  ensureDirectoryIndexes(destination);
  const details = exportSource ? `Copied from out/ after ${exportSource}` : 'Copied from out/ after build';
  return { status: 'built', details };
}

function buildReactProject({ project, projectDir, manager, scripts }) {
  const buildCommand = getScriptCommand(manager, scripts, 'build');
  if (!buildCommand) {
    return {
      status: 'skipped',
      details: 'No "build" script configured',
    };
  }

  const basePathEnv = `/index-assets/${project.id}`;
  runCommand(buildCommand, projectDir, `Building ${project.id}`, {
    env: {
      PUBLIC_URL: basePathEnv,
    },
  });
  const outputDir = resolveOutputDir(projectDir, ['dist', 'build']);
  if (!outputDir) {
    return {
      status: 'skipped',
      details: 'Build succeeded but no dist/build folder was found',
    };
  }

  const destination = copyBuildToAssets(project.id, outputDir);
  applyBasePathRewrite(destination, project.id, {
    allowedExtensions: new Set(['.html', '.css']),
  });
  return { status: 'built', details: `Copied from ${path.basename(outputDir)}` };
}

function buildViteProject(context) {
  // For Vite projects we just reuse the React builder logic
  return buildReactProject(context);
}

function copyBuildToAssets(projectId, sourceDir) {
  const destination = path.join(OUTPUT_ROOT, projectId);
  if (fs.existsSync(destination)) {
    fs.rmSync(destination, { recursive: true, force: true });
  }

  fs.mkdirSync(destination, { recursive: true });
  copyDirectory(sourceDir, destination);
  console.log(`✔ Copied build → ${path.relative(ROOT_DIR, destination)}`);
  return destination;
}

function resolveOutputDir(projectDir, candidates) {
  for (const name of candidates) {
    const target = path.join(projectDir, name);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      return target;
    }
  }
  return null;
}

function installDependencies(manager, cwd) {
  const installCommand = getInstallCommand(manager);
  runCommand(installCommand, cwd, 'Installing dependencies');
}

function runCommand(command, cwd, label, { allowFailure = false, env: extraEnv } = {}) {
  console.log(`\n${label} → ${command}`);
  const result = spawnSync(command, {
    cwd,
    shell: true,
    stdio: 'inherit',
    env: {
      ...process.env,
      FORCE_COLOR: '1',
      ...(extraEnv || {}),
    },
  });

  if (result.status !== 0 && !allowFailure) {
    throw new Error(`Command failed with exit code ${result.status}`);
  }

  return result.status ?? 0;
}

function detectPackageManager(dir) {
  if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(dir, 'package-lock.json'))) return 'npm';
  if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(dir, 'bun.lockb'))) return 'bun';
  return 'npm';
}

function getRunner(manager) {
  switch (manager) {
    case 'pnpm':
      return 'pnpm';
    case 'yarn':
      return 'yarn';
    case 'bun':
      return 'bun';
    case 'npm':
    default:
      return 'npx';
  }
}

function getScriptCommand(manager, scripts, scriptName) {
  if (!scripts || !scripts[scriptName]) return null;
  switch (manager) {
    case 'pnpm':
      return `pnpm ${scriptName}`;
    case 'yarn':
      return `yarn ${scriptName}`;
    case 'bun':
      return `bun run ${scriptName}`;
    case 'npm':
    default:
      return `npm run ${scriptName}`;
  }
}

function getInstallCommand(manager) {
  switch (manager) {
    case 'pnpm':
      return 'pnpm install';
    case 'yarn':
      return 'yarn install';
    case 'bun':
      return 'bun install';
    case 'npm':
    default:
      return 'npm install';
  }
}

function copyDirectory(source, destination) {
  const entries = fs.readdirSync(source, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const link = fs.readlinkSync(srcPath);
      fs.symlinkSync(link, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function applyBasePathRewrite(destinationDir, projectId, options = {}) {
  const basePath = `/index-assets/${projectId}`;
  const files = collectFiles(destinationDir);
  const { allowedExtensions } = options;
  files.forEach((filePath) => {
    if (!shouldRewriteFile(filePath, allowedExtensions)) return;
    const original = fs.readFileSync(filePath, 'utf8');
    const rewritten = rewriteContentWithBasePath(original, basePath, filePath);
    if (rewritten !== original) {
      fs.writeFileSync(filePath, rewritten);
    }
  });
}

function shouldRewriteFile(filePath, allowedExtensions) {
  const ext = path.extname(filePath).toLowerCase();
  if (allowedExtensions && !allowedExtensions.has(ext)) return false;
  if (!TEXT_EXTENSIONS.has(ext)) return false;

  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/_next/static/')) {
    // Never rewrite Next.js generated runtime chunks or manifests
    if (ext === '.css' || ext === '.map') return true;
    return false;
  }

  return true;
}

function collectFiles(directory, bucket = []) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  entries.forEach((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectFiles(entryPath, bucket);
    } else if (entry.isFile()) {
      bucket.push(entryPath);
    }
  });
  return bucket;
}

function rewriteContentWithBasePath(content, basePath, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const placeholders = [];
  let working = content;

  if (ext === '.html') {
    const scriptMatcher = /<script[^>]*>[\s\S]*?<\/script>/g;
    working = working.replace(scriptMatcher, (match) => {
      if (!match.includes('__NEXT_DATA__') && !match.includes('self.__next_f')) {
        return match;
      }

      const placeholder = `__NEXT_DATA_PLACEHOLDER__${placeholders.length}__`;
      placeholders.push({ placeholder, script: transformNextDataScript(match, basePath) });
      return placeholder;
    });
  }

  let output = applyGenericBasePathRewrite(working, basePath);

  for (const { placeholder, script } of placeholders) {
    output = output.replace(placeholder, script);
  }

  return output;
}

function applyGenericBasePathRewrite(content, basePath) {
  let output = content;
  const protocolGuard = '(?:index-assets|https?:|mailto:|tel:|data:|javascript:)';

  const attrDouble = new RegExp(
    `(href|src|poster|data-src|data-href|content)="/(?!/|${protocolGuard})`,
    'gi'
  );
  const attrSingle = new RegExp(
    `(href|src|poster|data-src|data-href|content)='/(?!/|${protocolGuard})`,
    'gi'
  );

  output = output.replace(attrDouble, (_, attr) => `${attr}="${basePath}/`);
  output = output.replace(attrSingle, (_, attr) => `${attr}='${basePath}/`);

  const stringLiteral = new RegExp(
    `(["'])/(?!/|${protocolGuard}|>)([^"']*)`,
    'g'
  );
  output = output.replace(stringLiteral, (match, quote, rest) => {
    return `${quote}${basePath}/${rest}`;
  });

    const cssUrl = new RegExp(
      "url\\((['\"]?)\\/(?!\/|" + protocolGuard + ")([^'\"\\)]+)\\1\\)",
      'g'
    );
  output = output.replace(cssUrl, (match, quote, rest) => {
    const q = quote || '';
    return `url(${q}${basePath}/${rest}${q})`;
  });

  const cssUrlRelativeNext = /url\((['"]?)(_next\/[\w./-]+)\1\)/g;
  output = output.replace(cssUrlRelativeNext, (match, quote, rest) => {
    const q = quote || '';
    return `url(${q}${basePath}/${rest}${q})`;
  });

  const stringRelativeNext = new RegExp(
    `(["'])_next/(?!${protocolGuard})([^"']*)`,
    'g'
  );
  output = output.replace(stringRelativeNext, (match, quote, rest) => {
    return `${quote}${basePath}/_next/${rest}`;
  });

  const srcsetRegex = /srcset=("|')([^"']*)("|')/gi;
  output = output.replace(srcsetRegex, (match, quote, value) => {
    const rewrittenValue = value.replace(
      /(^|,\s*)\/(?!\/|index-assets|https?:|mailto:|tel:|data:)/g,
      (segment) => segment.replace('/', `${basePath}/`)
    );
    return `srcset=${quote}${rewrittenValue}${quote}`;
  });

  output = output.replace(/\.\/_next/g, `${basePath}/_next`);

  return output;
}

function transformNextDataScript(scriptTag, basePath) {
  const normalizedBasePath = basePath && basePath !== '/' ? basePath : '';
  if (!normalizedBasePath) return scriptTag;

  const jsonMatch = scriptTag.match(/>([\s\S]*?)<\/script>/);
  if (!jsonMatch) return scriptTag;

  const scriptBody = jsonMatch[1];

  if (scriptTag.includes('id="__NEXT_DATA__"')) {
    try {
      const data = JSON.parse(scriptBody);

      data.assetPrefix = normalizedBasePath;
      data.basePath = normalizedBasePath;

      if (typeof data.page === 'string' && data.page.startsWith(normalizedBasePath)) {
        const trimmed = data.page.slice(normalizedBasePath.length) || '/';
        data.page = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
      }

      if (typeof data.route === 'string' && data.route.startsWith(normalizedBasePath)) {
        const trimmedRoute = data.route.slice(normalizedBasePath.length) || '/';
        data.route = trimmedRoute.startsWith('/') ? trimmedRoute : `/${trimmedRoute}`;
      }

      const serialized = JSON.stringify(data);
      return scriptTag.replace(scriptBody, serialized);
    } catch (error) {
      return scriptTag;
    }
  }

  if (scriptTag.includes('self.__next_f')) {
    return scriptTag.replace(scriptBody, rewriteFlightDataPayload(scriptBody, normalizedBasePath));
  }

  return scriptTag;
}

function rewriteFlightDataPayload(payload, basePath) {
  const escapedBasePath = basePath.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  let updated = payload;

  let sawAssetPrefix = false;
  const assetPrefixPattern = /\\"assetPrefix\\":\\"([^\\"]*)\\"/g;
  updated = updated.replace(assetPrefixPattern, () => {
    sawAssetPrefix = true;
    return `\\"assetPrefix\\":\\"${escapedBasePath}\\"`;
  });

  const basePathPattern = /\\"basePath\\":\\"([^\\"]*)\\"/g;
  if (basePathPattern.test(updated)) {
    updated = updated.replace(basePathPattern, () => `\\"basePath\\":\\"${escapedBasePath}\\"`);
  } else if (sawAssetPrefix) {
    updated = updated.replace(/\\"assetPrefix\\":\\"[^\\"]*\\"/, (match) => `${match},\\"basePath\\":\\"${escapedBasePath}\\"`);
  } else {
    updated = updated.replace(/\\"buildId\\":\\"([^\\"]*)\\"/, (match) => `${match},\\"assetPrefix\\":\\"${escapedBasePath}\\",\\"basePath\\":\\"${escapedBasePath}\\"`);
  }

  const publicPathPattern = /__next_set_public_path__\((['"])\\\/_next\//g;
  updated = updated.replace(publicPathPattern, (_, quote) => `__next_set_public_path__(${quote}${basePath}/_next/`);

  return updated;
}

function ensureDirectoryIndexes(rootDir) {
  const htmlFiles = collectFiles(rootDir).filter((filePath) => {
    if (path.extname(filePath).toLowerCase() !== '.html') return false;
    const fileName = path.basename(filePath).toLowerCase();
    if (fileName === 'index.html' || fileName === '404.html') return false;
    const relative = path.relative(rootDir, filePath);
    return !relative.startsWith('_next' + path.sep);
  });

  htmlFiles.forEach((filePath) => {
    const directory = path.join(path.dirname(filePath), path.basename(filePath, '.html'));
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const target = path.join(directory, 'index.html');
    fs.renameSync(filePath, target);
  });
}

function ensureDir(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function ensureExists(target, message) {
  if (!fs.existsSync(target)) {
    throw new Error(message);
  }
}

function cleanOutput() {
  if (fs.existsSync(OUTPUT_ROOT)) {
    fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
}

function regenerateInventory() {
  const scriptPath = path.join(__dirname, 'generate-projects.js');
  if (!fs.existsSync(scriptPath)) return;
  console.log('\nUpdating inventory…');
  const result = spawnSync('node', [scriptPath], { stdio: 'inherit', shell: false });
  if (result.status !== 0) {
    console.warn('Failed to regenerate projects.js. Run the generator manually.');
  }
}
