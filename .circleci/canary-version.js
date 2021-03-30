#!/usr/bin/env node

const fs = require('fs');
const root = require('../package.json');
const styles = require('../packages/styles/package.json');
const react = require('../packages/react/package.json');

if (!process.env.CIRCLE_SHA1) {
  throw new Error('No CIRCLE SHA available.');
}

const sha = process.env.CIRCLE_SHA1.substring(0, 8);
const version = `${root.version}-canary.${sha}`;

console.log('Updating versions to %s', version);

root.version = version;
fs.writeFileSync('./package.json', JSON.stringify(root, null, 2));

styles.version = version;
fs.writeFileSync(
  './packages/styles/package.json',
  JSON.stringify(styles, null, 2)
);

react.version = version;
fs.writeFileSync(
  './packages/react/package.json',
  JSON.stringify(react, null, 2)
);
