# Documentation

Cauldron documentation is a mix of [mdxjs](https://mdxjs.com/) and custom react components to scaffold documentation.

## Structure

```
├── assets/             # Static assets (logos, favicon) for documentation
├── components/         # Custom components to for documentation layout/structure
├── Demo/               # Deprecated documentation, do not use
├── pages/              # MDX components mapping to specific pages in documentation
│   └── components/     # MDX component level documentation
├── patterns/           # Deprecated documentation, do not use
├── utils/              # Shared utilites for documentation
├── mdx-components.tsx  # Used to allow for rendering of html tags for custom components (see https://mdxjs.com/table-of-components/)
└── remark-plugins.tsx  # Remark plugins to transform markdown ast - mainly used to support things like TOCs and front matter
```

## Component Documentation

To add document for a component, add a `.mdx` file to `pages/components` with the name of your component, i.e. `MyComponent.mdx`. A component should minimally include the following [frontmatter](https://mdxjs.com/guides/frontmatter/):

- `title` - Will be used as the title and primary heading of the component
- `description` - A short description of the component
- `source` - A url to the github source of the component

An example of frontmatter for the Button component as follows:

```md
---
title: Button
description: An interactive component that performs a programmable action when activated by the user.
source: https://github.com/dequelabs/cauldron/tree/develop/packages/react/src/components/Button/index.tsx
---
```

Frontmatter can also include:

- `deprecated` - boolean value flagging the component as deprecated (which display a tag and display component in a separate deprecated section)
- `path` - Used when the url path needs to be different than the default name of the mdx file

### Writing Good Documentation

Good documentation should try to cover different use cases for the component, and include the when, why, and how of a component. This includes things like:

- Showing examples of a component with different variants and states
- Calling out specific accessibility requirements if there's a common need for a component to set things like labels or ids
- Including documentation for all of the component props
- Providing references to other components that may be related
