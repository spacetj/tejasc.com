#!/usr/bin/env bash
set -euo pipefail

TOKEN="${TF_CLOUD_TOKEN:-}"

if [[ -z "${TOKEN}" ]]; then
  echo "TF_CLOUD_TOKEN is not set. Export a Terraform Cloud user token and rerun." >&2
  exit 1
fi

TERRAFORM_DIR="${HOME}/.terraform.d"
mkdir -p "${TERRAFORM_DIR}"

cat > "${TERRAFORM_DIR}/credentials.tfrc.json" <<EOF
{
  "credentials": {
    "app.terraform.io": {
      "token": "${TOKEN}"
    }
  }
}
EOF

echo "Terraform Cloud credentials written to ${TERRAFORM_DIR}/credentials.tfrc.json"
