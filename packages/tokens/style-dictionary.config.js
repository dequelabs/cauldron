/**
 * Style Dictionary config for cauldron tokens.
 *
 * Goals:
 *   1. Match the existing CSS custom property names from packages/styles/variables.css
 *      exactly (e.g. `--gray-20`, `--accent-primary`, `--text-color-base`).
 *   2. Preserve references between tokens in the output, so semantic aliases
 *      stay as `var(--gray-20)` rather than the inlined hex value.
 *
 * The JSON sources are authored so the default `name/kebab` transform yields
 * the desired output names — see the comments in src/core/color.json and
 * src/semantic/color.json for the nesting conventions.
 */
module.exports = {
  source: ['src/core/**/*.json', 'src/semantic/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root'
          }
        }
      ]
    }
  }
};
