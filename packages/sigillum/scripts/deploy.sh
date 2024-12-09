#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Adds the latest version to the issue templates.
#
# $1 - The name of the token.
# $2 - The symbol of the token.
#
# Examples
#
#   ./bin/deploy.sh "Sigillum Ordo Administratorum" "SOA"
#
# Returns exit code 0 if successful, or 1 if the semantic version is incorrectly formatted.
function main {
  set_vars

  if [ -z "${1}" ]; then
    printf "%b no name specified, use: ./bin/deploy.sh [name] [symbol] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${2}" ]; then
    printf "%b no symbol specified, use: ./bin/deploy.sh [name] [symbol] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  source .env

  if [ -z "${PRIVATE_KEY}" ]; then
    printf "%b PRIVATE_KEY env var not set in the .env file \n" "${ERROR_PREFIX}"
    exit 1
  fi

  if [ -z "${RPC_URL}" ]; then
    printf "%b RPC_URL env var not set in the .env file \n" "${ERROR_PREFIX}"
    exit 1
  fi

  # deploy the contract
  forge create Sigillum \
    --rpc-url="${RPC_URL}" \
    --private-key="${PRIVATE_KEY}" \
    --constructor-args "${1}" "${2}"

  exit 0
}

# and so, it begins...
main "$@"
