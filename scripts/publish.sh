#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

# run the build
npm run build
#deploy with semantic-release
npm run semantic-release --dry-run --no-ci
