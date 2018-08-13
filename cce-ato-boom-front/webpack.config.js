'use strict';

var path = require('path');
var webpack = require('webpack');
var UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var node_modules = path.resolve(__dirname, './node_modules');
var dir_src = path.resolve(__dirname, './app');
var dir_build = path.resolve(__dirname, './public/app');

var development = process.env.NODE_ENV == 'development';

module.exports = {
    entry: ["babel-polyfill", path.resolve(dir_src, 'main.js')],
    output: {
        path: dir_build, // for standalone building
        filename: 'bundle.min.js'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dns: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            plugins: ['transform-decorators-legacy', 'transform-runtime' ],
                            presets: ['es2015', 'react', 'stage-0']
                        }
                    }
                ],
                exclude: /node_modules\/(?!(koa-sso-auth-cli|koa-generic-session|koa-router)\/).*/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: development ? [
        new webpack.ProvidePlugin({
            Promise: 'es6-promise'
        })
    ]: [
        new UglifyjsWebpackPlugin(),
        new webpack.ProvidePlugin({
            Promise: 'es6-promise'
        })
    ]
};