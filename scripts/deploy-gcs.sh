#!/usr/bin/env bash

set -euo pipefail

BUCKET_NAME="${BUCKET_NAME:-gs://tejasc.com}"

rm -rf ./public
npm run build

cd ./public && gsutil -m rsync -d -R . "${BUCKET_NAME}"

gsutil ls \
  "${BUCKET_NAME}/*.html" \
  "${BUCKET_NAME}/_gatsby/slices/*.html" \
  "${BUCKET_NAME}/page-data/*.json" \
  "${BUCKET_NAME}/page-data/**/*.json" \
  "${BUCKET_NAME}/chunk-map.json" \
  "${BUCKET_NAME}/sw.js" \
  | sort -u \
  | xargs gsutil -m setmeta -h "Cache-Control:no-cache, max-age=0, must-revalidate"

echo "Deployed successfully to ${BUCKET_NAME}"
