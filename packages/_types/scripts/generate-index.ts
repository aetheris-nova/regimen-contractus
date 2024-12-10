import chalk from 'chalk';
import { readdirSync, type Stats, statSync, writeFileSync } from 'node:fs';
import { join, parse, type ParsedPath } from 'node:path';
import * as process from 'node:process';

/**
 * Script that creates the index.ts file in the `src/` directory.
 */
function main(): void {
  const srcDir = 'src';
  const exports = ['// exports will be generated automatically generated using: npm run generate:index'];
  let file: ParsedPath;
  let indexFilePath: string;
  let stat: Stats;

  for (const item of readdirSync(srcDir)) {
    stat = statSync(join(srcDir, item));

    // if it is not a file or it is the index file, move on
    if (!stat.isFile() || item === 'index.ts') {
      continue;
    }

    file = parse(item);

    exports.push(`export type { default as ${file.name} } from './${file.name}';`);
  }

  indexFilePath = join(srcDir, 'index.ts');

  // write to index file
  writeFileSync(indexFilePath, `${exports.join('\n')}\n`, 'utf-8');

  console.log(`${chalk.yellow('[INFO]')}: generated indexes for components to "./src/index.ts"`);

  process.exit(0);
}

main();
