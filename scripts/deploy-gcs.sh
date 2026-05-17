#!/usr/bin/env bash

set -euo pipefail

BUCKET_NAME="${BUCKET_NAME:-gs://tejasc.com}"

rm -rf ./public
npm run build

cd ./public && gcloud storage rsync . "${BUCKET_NAME}" --recursive

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
