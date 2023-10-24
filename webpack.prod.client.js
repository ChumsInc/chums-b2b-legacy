const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const {WebpackManifestPlugin} = require("webpack-manifest-plugin");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const localProxy = {
    target: 'http://localhost:8081',
    // ignorePath: false,
    changeOrigin: true,
    secure: false,
};

const clientConfig = {
    target: 'web',
    mode: 'production',
    entry: {
        main: [
            './src/client/index.tsx',
        ],
    },
    devtool: 'source-map',
    output: {
        publicPath: '/build',
        path: path.resolve(__dirname, './public/build'),
        filename: "[name].[contenthash:8].js",
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({}),
    ],
}

module.exports = merge(common, clientConfig);
