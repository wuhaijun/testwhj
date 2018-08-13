'use strict';

var path = require('path');
var webpack = require('webpack');
var UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var node_modules = path.resolve(__dirname, './node_modules');
var dir_src = path.resolve(__dirname, './app');
var dir_build = path.resolve(__dirname, './public/bundle');

var development = process.env.NODE_ENV == 'development';

module.exports = {
    entry: ["babel-polyfill", path.resolve(dir_src, 'main.js')],
    output: {
        path: dir_build,
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
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            plugins: ['transform-decorators-legacy', 'transform-runtime' ],
                            presets: ['es2015', 'stage-0']
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
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: development ? []: [
        new UglifyjsWebpackPlugin()
    ]
};