#!/usr/bin/env node
/**
 * Launches a local dev server for a project in the CODEGRID workspace.
 *
 * Usage examples:
 *   node scripts/run-project.js --list
 *   node scripts/run-project.js showcase-cg-react-cards
 *   node scripts/run-project.js --id showcase-cg-react-cards --install
 *   node scripts/run-project.js --slug cg-react-cards --open
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT_DIR, 'projects.json');

main();

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.list) {
    listProjects(options);
    return;
  }

  if (!options.query) {
    console.error('No project specified. Pass an id, slug, or folder name.');
    console.error('Example: node scripts/run-project.js showcase-cg-react-cards');
    process.exit(1);
  }

  const data = loadProjects();
  const project = findProject(data.PROJECTS, options.query, options.category);

  if (!project) {
    console.error(`Unable to find a project matching "${options.query}".`);
    suggestProjects(data.PROJECTS, options.query);
    process.exit(1);
  }

  const projectDir = path.join(ROOT_DIR, decodeURIComponent(project.relativePath));
  ensureExists(projectDir, `Project directory not found: ${projectDir}`);

  const pkgPath = path.join(projectDir, 'package.json');
  ensureExists(pkgPath, 'This helper only works with projects that have a package.json file.');

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const scripts = pkg.scripts ?? {};
  const manager = detectPackageManager(projectDir);
  let devCommand = inferDevCommand(manager, scripts);

  if (options.script) {
    devCommand = buildScriptCommand(manager, options.script);
  }

  if (!devCommand) {
    console.error('Could not determine a dev command for this project.');
    console.error('Try specifying a script explicitly with --script <name>.');
    process.exit(1);
  }

  const installNeeded = !fs.existsSync(path.join(projectDir, 'node_modules'));
  if (installNeeded) {
    const installCommand = getInstallCommand(manager);
    if (!options.install) {
      console.warn('Dependencies have not been installed yet.');
      console.warn(`Run "${installCommand}" inside ${project.relativePath} or re-run with --install.`);
      process.exit(1);
    }
    runCommand(installCommand, projectDir, 'Installing dependencies');
  }

  console.log(`Launching ${project.title || project.id}`);
  console.log(`→ Directory: ${path.relative(ROOT_DIR, projectDir)}`);
  console.log(`→ Dev command: ${devCommand}`);
  if (options.open) {
    console.warn('Auto-opening the dev server is no longer supported. Launching without --open.');
  }

  runCommand(devCommand, projectDir, 'Starting dev server');
}

function parseArgs(args) {
  const options = {
    list: false,
    query: null,
    category: null,
    install: false,
    script: null,
    open: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case '--list':
        options.list = true;
        break;
      case '--id':
        options.query = args[i + 1];
        i += 1;
        break;
      case '--slug':
        options.query = args[i + 1];
        i += 1;
        break;
      case '--category':
        options.category = args[i + 1];
        i += 1;
        break;
      case '--install':
        options.install = true;
        break;
      case '--script':
        options.script = args[i + 1];
        i += 1;
        break;
      case '--open':
        options.open = true;
        break;
      default:
        if (!options.query) {
          options.query = arg;
        } else {
          options.query = `${options.query} ${arg}`;
        }
        break;
    }
  }

  if (options.query) {
    options.query = options.query.trim();
  }

  return options;
}

function loadProjects() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Missing projects.json. Run "node scripts/generate-projects.js" first.');
    process.exit(1);
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (error) {
    console.error('Failed to parse projects.json:', error.message);
    process.exit(1);
  }
}

function listProjects(options) {
  const data = loadProjects();
  const projects = data.PROJECTS;

  if (projects.length === 0) {
    console.log('No projects found. Generate the inventory first.');
    return;
  }

  console.log('Available projects:\n');
  projects.forEach((project) => {
    console.log(`- ${project.id}`);
    console.log(`  • Title: ${project.title || project.id}`);
    console.log(`  • Category: ${project.category}`);
    console.log(`  • Path: ${project.relativePath}`);
    console.log('');
  });
}

function findProject(projects, query, category) {
  if (!query) return null;

  const normalized = query.trim().toLowerCase();

  const exact = projects.find((project) => {
    if (category && project.category !== category) return false;
    const candidates = buildProjectAliases(project);
    return candidates.some((alias) => alias === normalized || alias === query);
  });

  if (exact) return exact;

  return projects.find((project) => {
    if (category && project.category !== category) return false;
    const tokens = buildProjectAliases(project);
    const textMatches = [project.title, project.relativePath]
      .filter(Boolean)
      .map((value) => value.toLowerCase());
    return (
      tokens.some((alias) => alias.includes(normalized)) ||
      textMatches.some((value) => value.includes(normalized))
    );
  });
}

function suggestProjects(projects, query) {
  const normalized = query.trim().toLowerCase();
  const candidates = projects
    .filter((project) => {
      const tokens = buildProjectAliases(project);
      const textMatches = [project.title, project.relativePath]
        .filter(Boolean)
        .map((value) => value.toLowerCase());
      return (
        tokens.some((alias) => alias.includes(normalized)) ||
        textMatches.some((value) => value.includes(normalized))
      );
    })
    .slice(0, 8);

  if (candidates.length === 0) return;

  console.log('\nDid you mean:');
  candidates.forEach((project) => {
    console.log(`  → ${project.id} (${project.title || project.id})`);
  });
}

function buildProjectAliases(project) {
  const aliases = new Set();
  if (project.id) aliases.add(project.id.toLowerCase());
  if (project.title) {
    aliases.add(project.title.toLowerCase());
    const titleSlug = toSlug(project.title);
    if (titleSlug) aliases.add(titleSlug);
  }
  const folderName = getFolderName(project.relativePath);
  if (folderName) {
    aliases.add(folderName.toLowerCase());
    const folderSlug = toSlug(folderName);
    if (folderSlug) aliases.add(folderSlug);
  }
  return Array.from(aliases).filter(Boolean);
}

function getFolderName(relativePath) {
  if (!relativePath) return null;
  const segments = relativePath.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const folder = segments[segments.length - 1];
  try {
    return decodeURIComponent(folder);
  } catch (error) {
    return folder;
  }
}

function toSlug(value) {
  if (!value) return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function ensureExists(target, message) {
  if (!fs.existsSync(target)) {
    console.error(message);
    process.exit(1);
  }
}

function detectPackageManager(dir) {
  if (fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(dir, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(dir, 'bun.lockb'))) return 'bun';
  return fs.existsSync(path.join(dir, 'package-lock.json')) ? 'npm' : 'npm';
}

function inferDevCommand(manager, scripts = {}) {
  if (scripts.dev) return buildScriptCommand(manager, 'dev');
  if (scripts.start) return buildScriptCommand(manager, 'start');
  if (scripts.serve) return buildScriptCommand(manager, 'serve');
  return null;
}

function buildScriptCommand(manager, script) {
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

function runCommand(command, cwd, label) {
  console.log(`\n${label} → ${command}`);
  const child = spawn(command, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error(`Failed to run command: ${error.message}`);
    process.exit(1);
  });
}
