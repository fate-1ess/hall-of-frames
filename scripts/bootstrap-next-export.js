#!/usr/bin/env node
/**
 * Ensures every Next.js project in CODEGRID has a static-export compatible configuration.
 *
 * - Creates a `next.config.js` file when missing.
 * - Leaves existing configurations untouched but reports them so they can be audited manually.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATASET_PATH = path.join(ROOT_DIR, 'projects.json');
const TEMPLATE = `/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  output: 'export',\n  images: {\n    unoptimized: true,\n  },\n};\n\nmodule.exports = nextConfig;\n`;

main();

function main() {
  const dataset = loadDataset();
  const nextProjects = dataset.PROJECTS.filter((project) =>
    (project.framework || '').toLowerCase().includes('next'),
  );

  if (nextProjects.length === 0) {
    console.log('No Next.js projects detected. Nothing to do.');
    return;
  }

  console.log(`Preparing ${nextProjects.length} Next.js projects for static export...`);

  const results = { created: [], skipped: [], existing: [] };

  nextProjects.forEach((project) => {
    const relativePath = decodeURIComponent(project.relativePath).replace(/[\\/]+$/, '');
    const projectDir = path.join(ROOT_DIR, relativePath);
    if (!fs.existsSync(projectDir)) {
      results.skipped.push({ project, reason: `Directory not found: ${projectDir}` });
      return;
    }

    const existingConfig = findExistingConfig(projectDir);
    if (existingConfig) {
      results.existing.push({ project, configFile: path.relative(projectDir, existingConfig) });
      return;
    }

    const configPath = path.join(projectDir, 'next.config.js');
    fs.writeFileSync(configPath, TEMPLATE, 'utf8');
    results.created.push({ project, configFile: path.relative(ROOT_DIR, configPath) });
  });

  console.log('\nSummary:');
  console.log(`  Created → ${results.created.length}`);
  console.log(`  Existing → ${results.existing.length}`);
  console.log(`  Skipped → ${results.skipped.length}`);

  if (results.created.length) {
    console.log('\nCreated configs:');
    results.created.forEach(({ project, configFile }) => {
      console.log(`  • ${project.id} → ${configFile}`);
    });
  }

  if (results.existing.length) {
    console.log('\nProjects with existing config (review manually if needed):');
    results.existing.forEach(({ project, configFile }) => {
      console.log(`  • ${project.id} → ${configFile}`);
    });
  }

  if (results.skipped.length) {
    console.log('\nProjects skipped:');
    results.skipped.forEach(({ project, reason }) => {
      console.log(`  • ${project.id} → ${reason}`);
    });
  }
}

function loadDataset() {
  if (!fs.existsSync(DATASET_PATH)) {
    throw new Error('Missing projects.json. Run "node scripts/generate-projects.js" first.');
  }

  try {
    return JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
  } catch (error) {
    throw new Error(`Failed to parse projects.json: ${error.message}`);
  }
}

function findExistingConfig(projectDir) {
  const candidates = [
    'next.config.js',
    'next.config.mjs',
    'next.config.cjs',
    'next.config.ts',
    'next.config.mts',
  ];

  for (const filename of candidates) {
    const resolved = path.join(projectDir, filename);
    if (fs.existsSync(resolved)) {
      return resolved;
    }
  }

  return null;
}
