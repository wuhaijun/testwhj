'use strict';

// config/webpack.config.js
var path = require('path');
var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var node_modules = path.resolve(__dirname, './node_modules');

var dir_src = path.resolve(__dirname, './app/components');
var dir_build = path.resolve(__dirname, './public/build');

module.exports = {
    entry: path.resolve(dir_src, 'main.jsx'),
    output: {
        path: dir_build, // for standalone building
        filename: 'bundle.js'
    },
    // webpack-dev-server默认配置项，建议使用
    devServer: {
        contentBase: dir_build
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    plugins: ['transform-decorators-legacy' ],
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.css$/,
                loader:'style!css!'
            },
            {
                test: /\.less$/,
                loader: "style!css!less"
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.NoErrorsPlugin()
        // new UglifyJSPlugin()
    ],
    stats: {
        colors: true // Nice colored output
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map'
};