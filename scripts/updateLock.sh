#!/usr/bin/env bash

THISDIR=`dirname "$0"`

deno cache --lock="${THISDIR}/../lock.json" --lock-write "${THISDIR}/../deps.ts"
