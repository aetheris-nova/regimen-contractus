#!/usr/bin/env bash

source $(dirname "${BASH_SOURCE[0]}")/set_vars.sh

# Public: Runs test against and anvil node running on http://127.0.0.1:8545
#
# $1 - The name of the package, i.e. @aetherisnova/sigillum.
#
# Examples
#
#   ./test_with_anvil.sh "@aetherisnova/sigillum"
#
# Returns with exit code 1 if the tests fail or not package was supplied, otherwise exit code 0 is returned.
function main {
  local attempt
  local container_name
  local exit_code
  local health
  local service_name

  attempt=0
  exit_code=0
  health=starting

  set_vars

  if [ -z "${1}" ]; then
    printf "%b no package specified, use: ./test_with_anvil.sh [package] \n" "${ERROR_PREFIX}"
    exit 1
  fi

  docker compose up \
    --build \
    -d

  container_name=aetherisnova_anvil
  service_name=anvil

  while [ ${attempt} -le 29 ]; do
    sleep 2

    attempt=$((attempt + 1))

    printf "%b waiting for healthcheck (%b), attempt: %b...\n" "${INFO_PREFIX}" "${health}" "${attempt}"

    health=$(docker inspect -f "{{.State.Health.Status}}" "${container_name}")

    if [[ "${health}" == "healthy" || "${health}" == "unhealthy" ]]; then
      printf "%b service %b status: %b\n" "${INFO_PREFIX}" "${service_name}" "${health}"
      break
    fi
  done

  # if the service are up and running, we can run tests
  if [[ "${health}" == "healthy" ]]; then
    pnpm -F "${1}" run test
    exit_code=$? # get exit code of tests
  else
    docker logs --details "${container_name}"
    exit_code=1
  fi

  # stop the services and remove
  docker compose down

  exit ${exit_code}
}

# And so, it begins...
main "$@"
