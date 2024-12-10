#!/usr/bin/env bash

# Public: A post-install script that is run from npm's `postinstall` script. This script will build the required
# workspace dependencies.
#
# Examples
#
#   ./bin/postinstall.sh
#
# Returns exit code 0.
function main {
  # build workspace dependencies
  pnpm -F _types run build
  pnpm -F _utils run build

  exit 0
}

# and so, it begins...
main "$@"
