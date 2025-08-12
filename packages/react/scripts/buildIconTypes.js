const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ICON_COMPONENT_DIRECTORY = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'Icon'
);
const ICONS_DIRECTORY = path.join(ICON_COMPONENT_DIRECTORY, 'icons');
const ICON_TYPES_FILE = path.join(ICON_COMPONENT_DIRECTORY, 'types.ts');
const ICONS_WITH_DIRECTIONS = [
  'arrow',
  'arrow-circle',
  'chevron',
  'chevron-double',
  'triangle'
];
const DIRECTIONS = ['up', 'down', 'left', 'right'];

/**
 * Some icons have duplicate mappings this object should maintain list of icons
 * that do not directly map to an SVG icon.
 */
const ADDITIONAL_TYPE = ['filter-solid'];

assert(
  fs.existsSync(ICON_COMPONENT_DIRECTORY),
  'Unable to locate Icon component'
);
assert(fs.existsSync(ICONS_DIRECTORY), 'Unable to locate icons directory');

const files = fs.readdirSync(ICONS_DIRECTORY);

const iconTypes = [];
for (const file of files) {
  if (!file.endsWith('.svg')) {
    continue;
  }

  const name = file.replace('.svg', '');
  if (ICONS_WITH_DIRECTIONS.includes(name)) {
    iconTypes.push(...DIRECTIONS.map((d) => `${name}-${d}`));
  } else {
    iconTypes.push(name);
  }
}

iconTypes.push(...ADDITIONAL_TYPES);

fs.writeFileSync(
  ICON_TYPES_FILE,
  `
/*!
 * GENERATED CODE. DO NOT EDIT DIRECTLY!
 */

/** IconType represents each valid icon type. */
export type IconType =
${iconTypes.map((i) => `  | '${i}'`).join('\n')};

/** iconTypes holds each valid icon type. */
export const iconTypes = [
${iconTypes.map((i) => `  '${i}'`).join(',\n')}
];
`.trim()
);

console.log('Wrote %d icon types', iconTypes.length);
