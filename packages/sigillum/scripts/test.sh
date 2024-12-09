#!/usr/bin/env bash

source $(dirname "${BASH_SOURCE[0]}")/set_vars.sh

# Public:
#
# $1 - the name of the chain.
#
# Examples
#
#   ./bin/test.sh "conflux"
#
# Returns with exit code 1 if the tests fail, otherwise exit code 0 is returned.
function main {
  local attempt
  local container_name
  local exit_code
  local health
  local service_name

  attempt=0
  exit_code=0
  health=starting
  service_name="${1}_node"

  set_vars

  docker compose up \
    "${service_name}" \
    --build \
    -d

  container_name=$(docker compose ps --format json | jq --arg service_name "${service_name}" -r '.[] | select(.Service==$service_name) .Name')

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
    pnpm build
    yarn jest ".*.${1}.test.ts"
    exit_code=$? # get exit code of tests
  else
    docker logs --details "${container_name}"
    exit_code=1
  fi

  # stop the services and remove
  docker-compose down

  exit ${exit_code}
}

# And so, it begins...
main "$1"
