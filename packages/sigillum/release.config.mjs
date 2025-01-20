import packageJSON from './package.json' assert { type: 'json' };

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    'main',
    {
      name: 'beta',
      prerelease: true,
    },
  ],
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@anolilab/semantic-release-pnpm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: `chore(release): ${packageJSON.name}-v$\{nextRelease.version}

$\{nextRelease.notes}`
      }
    ],
    [
      '@semantic-release/github',
      {
        releasedLabels: ['🚀 released']
      },
    ],
  ],
};
