#!/bin/bash

source ./infra/.credentials

: "${CLOUDFLARE_EMAIL:?CLOUDFLARE_EMAIL needs to be set}"
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN needs to be set}"
: "${GOOGLE_CREDENTIALS:?GOOGLE_CREDENTIALS needs to be set}"

TERRAFORM=/usr/local/bin/terraform12

cd ./infra

${TERRAFORM} init -reconfigure -input=false;

${TERRAFORM} apply -lock-timeout=60s -input=false infra.plan
