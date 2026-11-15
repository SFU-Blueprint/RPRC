#!/usr/bin/env node
// Generates types/database.ts from the Supabase schema.
//   node scripts/gen-types.mjs           -> from the local stack (`npm run types`)
//   node scripts/gen-types.mjs --remote  -> from the hosted dev project (`npm run types:remote`)
// The file is only replaced once generation and formatting both succeed, so a stopped stack or a
// failed login never leaves an empty types/database.ts behind.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import * as prettier from 'prettier';

// Run the project's pinned CLI (devDependency) with this Node, without a shell.
const require = createRequire(import.meta.url);
const cliPackageJson = require.resolve('supabase/package.json');
const cliBin = JSON.parse(readFileSync(cliPackageJson, 'utf8')).bin.supabase;
const cliEntry = path.join(path.dirname(cliPackageJson), cliBin);

const DEV_PROJECT_ID = 'jxvpwuyzthaetqydjmgv';
const OUTPUT = 'types/database.ts';

const source = process.argv.includes('--remote')
  ? ['--project-id', DEV_PROJECT_ID]
  : ['--local'];

let generated;
try {
  generated = execFileSync(
    process.execPath,
    [cliEntry, 'gen', 'types', 'typescript', ...source, '--schema', 'public'],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
      maxBuffer: 64 * 1024 * 1024,
    },
  );
} catch {
  console.error(`Type generation failed; ${OUTPUT} was left unchanged.`);
  process.exit(1);
}

if (!generated.includes('export type Database')) {
  console.error(
    `Unexpected output from supabase gen types; ${OUTPUT} was left unchanged.`,
  );
  process.exit(1);
}

const config = (await prettier.resolveConfig(OUTPUT)) ?? {};
writeFileSync(
  OUTPUT,
  await prettier.format(generated, { ...config, filepath: OUTPUT }),
);
console.log(`Wrote ${OUTPUT}.`);
