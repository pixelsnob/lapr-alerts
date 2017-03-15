
'use strict';

var webpack           = require('webpack'),
    path              = require('path');

var app_dir = path.resolve(__dirname);

module.exports = {
  context: app_dir,
  entry: './client/app',
  output: {
     path: path.join(app_dir, 'client/dist'),
     publicPath: '/',
     filename: 'app.js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ],
  module : {
    loaders: [
      { 
        test: /\.js$/,
        loader: 'babel-loader'
      },
      { 
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
};


