/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

const { NODE_ENV = 'development' } = process.env;
const isProd = NODE_ENV === 'production';

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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
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
        loader: 'file-loader?name=public/fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devServer: {
    port: 8000,
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
    minimizer: [new OptimizeCSSAssetsPlugin({}), new TerserPlugin()]
  };
}

module.exports = config;
/* eslint-disable @typescript-eslint/no-var-requires */
