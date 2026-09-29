import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import remarkPlugins from './docs/remark-plugins.mjs';

const { NODE_ENV = 'development' } = process.env;
const isProd = NODE_ENV === 'production';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const config = {
  context: __dirname,
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : 'eval-source-map',
  entry: './docs/index.js',
  output: {
    path: path.resolve(__dirname, 'docs', 'dist'),
    filename: isProd ? '[name].[hash].js' : '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${isProd ? 'production' : 'development'}"`
      }
    }),
    new HtmlWebpackPlugin({
      template: './docs/index.html',
      favicon: './docs/assets/img/favicon.ico'
    })
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.mdx?$/,
        use: [
          {
            loader: '@mdx-js/loader',
            options: {
              remarkPlugins
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'public/fonts/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      '@deque/cauldron-react': path.resolve(__dirname, './packages/react/lib')
    },
    fallback: {
      path: false
    }
  },
  devServer: {
    port: 8003,
    historyApiFallback: true
  }
};

if (isProd) {
  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    })
  );

  config.optimization = {
    minimizer: [new CssMinimizerPlugin({}), new TerserPlugin()]
  };
}

export default config;
