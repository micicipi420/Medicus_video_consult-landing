#!/bin/sh
# build.sh
# Phase 39 / LAYOUT-03
# Thin delegator to `make build`. The Makefile is the canonical entry point;
# this script exists so contributors who don't know about make can still type
# `./build.sh` and get the same result.
set -eu
exec make build "$@"
