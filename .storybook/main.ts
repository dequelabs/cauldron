import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../packages/react/src/components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
    }
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@deque/cauldron-react': path.resolve(
        process.cwd(),
        'packages/react/lib'
      ),
      react: path.resolve(process.cwd(), 'node_modules/react'),
      'react-dom': path.resolve(process.cwd(), 'node_modules/react-dom')
    };

    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Exclude .svg from any default rules (asset/resource, etc.) so our
    // @svgr/webpack rule below takes over. Icon dynamically imports SVGs
    // and expects them as React components, matching the rollup build.
    config.module.rules.forEach((rule) => {
      if (
        rule &&
        typeof rule === 'object' &&
        rule.test instanceof RegExp &&
        rule.test.test('.svg')
      ) {
        rule.exclude = /\.svg$/;
      }
    });

    config.module.rules.unshift({
      test: /\.tsx?$/,
      include: [
        path.resolve(process.cwd(), 'packages/react/src'),
        path.resolve(process.cwd(), '.storybook')
      ],
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          presets: [
            ['@babel/preset-env', { targets: { esmodules: true } }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ]
        }
      }
    });

    config.module.rules.unshift({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false }
                  }
                },
                { name: 'removeDimensions', params: { active: true } },
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ height: 24 }, { width: 24 }]
                  }
                }
              ]
            }
          }
        }
      ]
    });

    return config;
  }
};

export default config;
