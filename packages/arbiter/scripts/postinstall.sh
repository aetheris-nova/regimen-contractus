#!/usr/bin/env bash

source $(dirname "${BASH_SOURCE[0]}")/set_vars.sh

# Public: Performs post install actions including installing Solidity dependencies.
#
# Examples
#
#   ./bin/postinstall.sh
#
# Returns exit code 0.
function main {
  set_vars

  # fetch solidity dependencies
  forge soldeer install

  exit 0
}

# and so, it begins...
main "$@"
