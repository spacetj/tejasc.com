#!/bin/bash

source ./infra/.credentials

: "${CLOUDFLARE_EMAIL:?CLOUDFLARE_EMAIL needs to be set}"
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN needs to be set}"
: "${GOOGLE_CREDENTIALS:?GOOGLE_CREDENTIALS needs to be set}"

cd ./infra

terraform init -reconfigure -input=false;

terraform validate;

terraform plan -input=false;
