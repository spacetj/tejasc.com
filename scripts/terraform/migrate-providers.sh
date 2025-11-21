#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INFRA_DIR="${ROOT_DIR}/infra"

if ! command -v terraform >/dev/null 2>&1; then
  echo "terraform binary is required on PATH" >&2
  exit 1
fi

cd "${INFRA_DIR}"

terraform init

terraform state replace-provider \
  registry.terraform.io/-/cloudflare \
  registry.terraform.io/cloudflare/cloudflare

terraform state replace-provider \
  registry.terraform.io/-/google \
  registry.terraform.io/hashicorp/google

terraform state replace-provider \
  registry.terraform.io/-/google-beta \
  registry.terraform.io/hashicorp/google-beta
