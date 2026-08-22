/**
 * `@types/react-syntax-highlighter` only declares the extensionless subpaths
 * (e.g. `.../dist/cjs/light`). The `Code` component imports the fully-specified
 * `.js` subpaths — required so strict-ESM bundlers can resolve them out of our
 * ESM build — so re-declare those to reuse the real types.
 */
declare module 'react-syntax-highlighter/dist/cjs/light.js' {
  export { default } from 'react-syntax-highlighter/dist/cjs/light';
}
declare module 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript.js' {
  export { default } from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
}
declare module 'react-syntax-highlighter/dist/cjs/languages/hljs/css.js' {
  export { default } from 'react-syntax-highlighter/dist/cjs/languages/hljs/css';
}
declare module 'react-syntax-highlighter/dist/cjs/languages/hljs/xml.js' {
  export { default } from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
}
declare module 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml.js' {
  export { default } from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml';
}
