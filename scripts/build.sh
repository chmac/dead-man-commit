#!/usr/bin/env bash

THISDIR=`dirname "$0"`

deno compile --allow-read --allow-run --allow-env \
  --output "${THISDIR}/../build/dead-man-commit.x86_64-apple-darwin" \
  "${THISDIR}/../mod.ts"