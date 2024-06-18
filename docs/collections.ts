import minimatch from 'minimatch';

type Collection<T = {}> = {
  name: string;
  title: string;
  Component: React.ReactElement;
  path: string;
} & T;

interface Collections {
  pages: Collection<{ index?: number }>[];
  components: Collection<{ deprecated?: boolean }>[];
  componentsV1: Collection[];
  foundations: Collection[];
}

/*
 * Maps specific components/mdx to collections:
 *  - Pages collection is for generic documentation (like getting started, or principles)
 *  - Components collection is for all component MDX documentation
 *
 * These collections can be used to automatically import/sort components and display
 * them in the relevant section within the site navigation.
 */
const collections: Collections = (require as any)
  .context('./', true, /\.(mdx|jsx?)$/)
  .keys()
  .reduce(
    (collections: Collections, key: string) => {
      const pagesMatch = minimatch(key, './pages/*.mdx');
      const componentMatch = minimatch(key, './pages/components/*.mdx');
      const foundationMatch = minimatch(key, './pages/foundations/*.mdx');
      const filepath = `docs${key.substring(1)}`;

      if (pagesMatch) {
        const name = key.match(/(\w+)\.mdx$/)?.[1] || '';
        const {
          default: Component,
          title,
          path,
          frontmatter,
          ...props
        } = require(`./pages/${name}.mdx`);
        const component = {
          name,
          title,
          Component,
          path: path || `/${name}`,
          filepath,
          ...frontmatter,
          ...props
        };
        collections.pages.push(component);
      } else if (componentMatch) {
        const name = key.match(/(\w+)\.mdx$/)?.[1] || '';
        const {
          default: Component,
          title,
          path,
          frontmatter,
          ...props
        } = require(`./pages/components/${name}.mdx`);
        const component = {
          name,
          title,
          Component,
          path: path || `/components/${name}`,
          filepath,
          ...frontmatter,
          ...props
        };
        collections.components.push(component);
      } else if (foundationMatch) {
        const name = key.match(/(\w+)\.mdx$/)?.[1] || '';
        const {
          default: Component,
          title,
          path,
          frontmatter,
          ...props
        } = require(`./pages/foundations/${name}.mdx`);
        const component = {
          name,
          title,
          Component,
          path: path || `/foundations/${name}`,
          filepath,
          ...frontmatter,
          ...props
        };
        collections.foundations.push(component);
      }

      return collections;
    },
    { pages: [], components: [], componentsV1: [], foundations: [] }
  );

// Pages should first be sorted by their index, then alphabetical
export const pages = [
  ...collections.pages
    .filter(({ index }) => !!index)
    .sort(
      (a, b) =>
        (a as Collection<{ index: number }>).index -
        (b as Collection<{ index: number }>).index
    ),
  ...collections.pages
    .filter(({ index }) => !index)
    .sort((a, b) => a.name.localeCompare(b.name))
];

export const components = [...collections.components].sort((a, b) =>
  a.name.localeCompare(b.name)
);

export const foundations = [...collections.foundations].sort((a, b) =>
  a.name.localeCompare(b.name)
);
