#!/usr/bin/env bash

# grab package version
export PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# update lerna.json
# note: you need 'jq' to run this (brew install jq or apt-get install jq)
cat lerna.json | jq --arg version "$PACKAGE_VERSION" '.version = $version' >> new.lerna.json
rm lerna.json
mv new.lerna.json lerna.json

# copy main README to chai-stuff package
cp README.md packages/chai-stuff
