<p align="center">
  <a href="https://kibis.is">
    <img alt="The TypeScript logo - a rounded corner blue square with a 'TS' in white" src="../../.assets/typescript_logo@128x128.png" style="padding-top: 15px" height="128" />
  </a>
</p>

<h1 align="center">
  Internal TypeScript Types
</h1>

<p align="center">
  TypeScript types for the contract clients.
</p>

### Table Of Contents

* [1. Getting Started](#-2-getting-started)
  - [1.1. Installation](#12-installation)
* [2. Appendix](#-2-appendix)
  - [2.1. Useful Commands](#21-useful-commands)
* [3. How To Contribute](#-3-how-to-contribute)
* [4. License](#-4-license)

> ⚠️ **NOTE:** This is private package and is not published. Its purpose is to be used globally within this monorepo.

## 🪄 1. Getting Started

### 1.1. Installation

You can install the types using:
```shell
pnpm add _types
```

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 2. Appendix

### 2.1. Useful Commands

| Command                   | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `pnpm run build`          | Generates declaration files to the `dist/` directory.                       |
| `pnpm run clean`          | Deletes the `dist/` directory and the `tsconfig.*.tsbuildinfo` files.       |
| `pnpm run generate:index` | Generates/overwrites the main `index.ts` file used for exporting all files. |
| `pnpm run lint`           | Runs the linter based on the rules in `eslint.config.mjs`.                  |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 3. How To Contribute

Please read the [**Contributing Guide**][contribute] to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 4. License

Please refer to the [LICENSE][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[contribute]: ../../CONTRIBUTING.md
[license]: LICENSE
[table-of-contents]: #table-of-contents

