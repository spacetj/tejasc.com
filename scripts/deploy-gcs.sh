#!/usr/bin/env bash

set -euo pipefail

BUCKET_NAME="${BUCKET_NAME:-gs://tejasc.com}"
SKIP_BUILD="${SKIP_BUILD:-0}"

if [[ "${SKIP_BUILD}" != "1" ]]; then
  npm run build
fi

if find ./public -type f -name "*.map" -print -quit | grep -q .; then
  echo "Refusing deploy: production output contains source maps." >&2
  exit 1
fi

map_objects="$(mktemp)"
gcloud storage ls \
  "${BUCKET_NAME}/*.map" \
  "${BUCKET_NAME}/**/*.map" \
  > "${map_objects}" 2>/dev/null || true

if [[ -s "${map_objects}" ]]; then
  while IFS= read -r object; do
    gcloud storage rm "${object}"
  done < "${map_objects}"
fi

rm -f "${map_objects}"

cd ./public && gcloud storage rsync . "${BUCKET_NAME}" \
  --recursive \
  --delete-unmatched-destination-objects \
  --exclude=".*\\.map$"

# Keep the exact /talks object fresh; it bypasses stale cached redirects to /talks/index.html.
gcloud storage cp ./talks/index.html "${BUCKET_NAME}/talks" \
  --content-type="text/html" \
  --cache-control="no-cache, max-age=0, must-revalidate"

gcloud storage ls \
  "${BUCKET_NAME}/*.html" \
  "${BUCKET_NAME}/**/*.html" \
  "${BUCKET_NAME}/_gatsby/slices/*.html" \
  "${BUCKET_NAME}/page-data/*.json" \
  "${BUCKET_NAME}/page-data/**/*.json" \
  "${BUCKET_NAME}/chunk-map.json" \
  "${BUCKET_NAME}/sw.js" \
  | sort -u \
  | gcloud storage objects update \
    --read-paths-from-stdin \
    --cache-control="no-cache, max-age=0, must-revalidate"

echo "Deployed successfully to ${BUCKET_NAME}"
