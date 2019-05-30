#!/usr/bin/env bash

# grab package version
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

MAJOR=${PACKAGE_VERSION:0:1}
MINOR=${PACKAGE_VERSION:2:1}
PATCH=${PACKAGE_VERSION:4}

if [ $1 = major ]; then let "MAJOR++"; fi
if [ $1 = minor ]; then let "MINOR++"; fi
if [ $1 = patch ]; then let "PATCH++"; fi

NEW_PACKAGE_VERSION=$MAJOR.$MINOR.$PATCH

# note: you need 'jq' to run this (brew install jq or apt-get install jq)
updateVersion() {
  cat $1.json \
    | jq --arg version "$NEW_PACKAGE_VERSION" '.version = $version' >> new.$1.json
  rm $1.json
  mv new.$1.json $1.json
}

# update all nested 'package.json'
for directory in ./packages/*/; do (cd $directory && updateVersion package); done

# update lerna.json
updateVersion lerna

# copy main README to chai-stuff package
cp README.md packages/chai-stuff

git add .
git commit -m "chore(release): Bump version to $NEW_PACKAGE_VERSION"

npm version $1

echo "$PACKAGE_VERSION -> $NEW_PACKAGE_VERSION"

: ${1?bumpVersion: "must pass argument major minor or patch"}
