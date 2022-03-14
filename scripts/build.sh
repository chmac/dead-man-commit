#!/usr/bin/env bash

THISDIR=`dirname "$0"`

deno compile --allow-read --allow-write --allow-run --allow-env \
  --target x86_64-apple-darwin \
  --output "${THISDIR}/../build/dead-man-commit.x86_64-apple-darwin" \
  "${THISDIR}/../mod.ts"

deno compile --allow-read --allow-write --allow-run --allow-env \
  --target x86_64-unknown-linux-gnu \
  --output "${THISDIR}/../build/dead-man-commit.x86_64-unknown-linux-gnu" \
  "${THISDIR}/../mod.ts"
  
deno compile --allow-read --allow-write --allow-run --allow-env \
  --target aarch64-apple-darwin \
  --output "${THISDIR}/../build/dead-man-commit.aarch64-apple-darwin" \
  "${THISDIR}/../mod.ts"
