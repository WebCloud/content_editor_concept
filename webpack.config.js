const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: './public/js',
    filename: 'bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'react'
          ],
          plugins: [
            'syntax-class-properties',
            'transform-class-properties',
            'syntax-decorators',
            'transform-decorators-legacy',
            'transform-object-rest-spread'
          ]
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css', 'postcss-loader', 'sass')
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new ExtractTextPlugin('../css/bundle.css', {
      allChunks: true
    })
  ],
  postcss() {
    return [require('autoprefixer')];
  }
};
