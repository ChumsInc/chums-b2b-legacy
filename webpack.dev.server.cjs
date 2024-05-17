const {merge} = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('path');
const webpack = require('webpack');

const buildDir = path.resolve(__dirname, './dist');

const serverConfig = {
    target: 'node',
    mode: 'development',
    name: 'server',
    entry: {
        server: './src/server/index.tsx'
    },
    devtool: 'inline-source-map',
    output: {
        path: buildDir,
        filename: "[name].js",
        sourceMapFilename: '[file].map',
        publicPath: '/',
    },
}

module.exports = merge(common, serverConfig);
