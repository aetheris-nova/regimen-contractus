import chalk from 'chalk';
import { readdirSync, type Stats, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as process from 'node:process';

/**
 * Script that creates the index.ts file in the `src/` directory.
 */
function main(): void {
  const srcDir = join(process.cwd(), 'src', 'client');
  const directories = ['models'];
  const exports: string[] = ['// exports will be generated automatically using: npm run generate:index'];
  let indexFilePath: string;
  let path: string;
  let stat: Stats;

  for (const directory of directories) {
    path = join(srcDir, directory);

    for (const item of readdirSync(path)) {
      stat = statSync(join(path, item));

      // if it is not a directory, move on
      if (!stat.isDirectory()) {
        continue;
      }

      exports.push(`export { default as ${item} } from './${directory}/${item}';`);
    }
  }

  // add all types
  exports.push(`export * from './types;'`);

  indexFilePath = join(srcDir, 'index.ts');

  // write to index file
  writeFileSync(indexFilePath, `${exports.join('\n')}\n`, 'utf-8');

  console.log(`${chalk.yellow('[INFO]')}: generated indexes for components to "./src/index.ts"`);

  process.exit(0);
}

main();
