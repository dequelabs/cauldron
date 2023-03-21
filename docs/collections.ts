import minimatch from 'minimatch';

type Collection<T = {}> = {
  name: string;
  title: string;
  Component: React.ReactElement;
  path: string;
} & T;

interface Collections {
  pages: Collection[];
  components: Collection<{ deprecated?: boolean }>[];
  componentsV1: Collection[];
}

/*
 * Maps specific components/mdx to collections:
 *  - Pages collection is for generic documentation (like getting started, or principles)
 *  - Components collection is for all component MDX documentation
 *  - ComponentsV1 collection is for all current (js) documentation
 *
 * These collections are can be used to automatically import/sort components and display
 * them in the relevant section within the site navigation.
 */
const collections: Collections = (require as any)
  .context('./', true, /\.(mdx|jsx?)$/)
  .keys()
  .reduce(
    (collections: Collections, key: string) => {
      const pagesMatch = minimatch(key, './pages/*.mdx');
      const componentMatch = minimatch(key, './pages/components/*.mdx');
      const componentsV1Match = minimatch(key, './patterns/components/**/*.js');
      const filepath = `docs${key.substring(1)}`;

      if (pagesMatch) {
        const name = key.match(/(\w+)\.mdx$/)?.[1] || '';
        const {
          default: Component,
          title,
          path,
          ...props
        } = require(`./pages/${name}.mdx`);
        const component = {
          name,
          title,
          Component,
          path: path || `/${name}`,
          filepath,
          ...props
        };
        collections.pages.push(component);
      } else if (componentMatch) {
        const name = key.match(/(\w+)\.mdx$/)?.[1] || '';
        const {
          default: Component,
          title,
          path,
          ...props
        } = require(`./pages/components/${name}.mdx`);
        const component = {
          name,
          title,
          Component,
          path: path || `/components/${name}`,
          filepath,
          ...props
        };
        collections.components.push(component);
      } else if (componentsV1Match) {
        const name = key.match(/(\w+)\/index\.jsx?$/)?.[1] || '';
        const { default: Component } = require(`./patterns/components/${name}`);
        const component = {
          name,
          title: name,
          Component,
          path: `/components/${name}`
        };
        collections.componentsV1.push(component);
      }

      return collections;
    },
    { pages: [], components: [], componentsV1: [] }
  );

// Merge V1/MDX components into a single list with MDX components taking priority
const componentsList: Collection<{ deprecated?: boolean }>[] = [
  ...collections.components,
  ...collections.componentsV1.filter(
    v1 => !collections.components.find(c => c.name === v1.name)
  )
].sort((a, b) => a.name.localeCompare(b.name));

export const pages = collections.pages;
export const components = componentsList;
export const componentsV2 = collections.components;
