#!/usr/bin/env bash

# Public: Performs pre-build actions such as building dependencies.
#
# Examples
#
#   ./bin/prebuild.sh
#
# Returns exit code 0.
function main {
  # build workspace dependencies
  pnpm -F @aetherisnova/regimen-contractus-types run build
  pnpm -F @aetherisnova/arbiter run build

  exit 0
}

# and so, it begins...
main "$@"
