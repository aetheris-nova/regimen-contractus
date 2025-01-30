<div align="center">
  <a href="https://aetherisnova.org" target="_blank">
    <img alt="An ornate golden compass surrounded by orbs" src="docs/images/emblem@128x128.png" height="64" />
  </a>
</div>

<h1 align="center">
  Regimen Contractus
</h1>

<p align="center">
  The Regimen Contractus of Aetheris Nova is the vault to the schemas that enact the will of the Aetherii.
</p>

---

### Table Of Contents

* [1. Overview](#-1-overview)
  - [1.1. Monorepo Project Structure](#11-monorepo-project-structure)
* [2. Getting Started](#-2-getting-started)
  - [2.1. Requirements](#21-requirements)
  - [2.2. Installation](#22-installation)
* [3. Appendix](#-3-appendix)
  - [3.1. Packages](#31-packages)
* [4. How To Contribute](#-4-how-to-contribute)

## 🗂️ 1. Overview

### 1.1. Monorepo Project Structure

The repo follows the following structure:

```text
.
├─ packages
│   ├── <package>
│   │   ├── .lintstagedrc.mjs
│   │   ├── .releaserc        <-- semantic release configuration
│   │   ├── LICENSE
│   │   ├── package.json      <-- contains package dependencies and is used to run package-level scripts
│   │   ├── README.md
│   │   └── ...
│   └── ...                   <-- other packages
├── package.json              <-- root package.json that contains top-level dependencies and tools
└── ...
```

#### Root `package.json`

The root `package.json` utilizes `pnpm`'s workspace feature. The root `package.json` should only reference packages that are used at the root level or are utilities/tools.

#### `packages/` Directory

The `packages/` directory contains, as the name suggests, the packages of the monorepo.

#### `packages/<package>` Directory

Each package **SHOULD** reflect the name of the package, i.e. the `packages/sigillum/` and **SHOULD** contain the following files and directories:

* `.lintstagedrc.mjs` - Scripts to run on the pre-commit hook. This file is **REQUIRED**, however, if there are no scripts to run, use an empty file.
* `.releaserc` - The local `semantic-release` configuration.
* `LICENSE` - The license for the package.
* `package.json` - The license for the package.
* `README.md` - Contains installation and usage instructions relevant to the package.

## 🪄 2. Getting Started

### 2.1. Requirements

* Install [Node v20.18.0+](https://nodejs.org/en/) (LTS as of 9th November 2024)
* Install [pnpm v8+](https://pnpm.io/installation)
* Install [Foundry](https://book.getfoundry.sh/getting-started/installation)

<sup>[Back to top ^][table-of-contents]</sup>

### 2.2. Installation

1. Install the dependencies using:

```shell
pnpm install
```

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 3. Appendix

### 3.1. Packages

| Name                                                      | Visibility | Description                                                                                         | Package                                                                                                                           |
|-----------------------------------------------------------|------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| [`arbiter`](./packages/arbiter/README.md)                 | `public`   | A smart contract that can create proposals and allows eligible sigillums to vote for the proposals. | [![NPM Version](https://img.shields.io/npm/v/%40aetherisnova%2Farbiter)](https://www.npmjs.com/package/%40aetherisnova/arbiter)   |
| [`codex-aetherium`](./packages/codex-aetherium/README.md) | `public`   | The frontend application that enables Aetherii to create, vote and execute proposals.               | -                                                                                                                                 |
| [`sigillum`](./packages/sigillum/README.md)               | `public`   | The basic smart contract for the Ordos membership NFTs.                                             | [![NPM Version](https://img.shields.io/npm/v/%40aetherisnova%2Fsigillum)](https://www.npmjs.com/package/%40aetherisnova/sigillum) |
| [`types`](./packages/types/README.md)                     | `private`  | TypeScript types for the contract clients.                                                          | -                                                                                                                                 |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 4. How To Contribute

Please read the [**Contributing Guide**](./CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- links -->
[table-of-contents]: #table-of-contents
