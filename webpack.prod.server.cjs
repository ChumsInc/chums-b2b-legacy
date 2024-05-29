const {merge} = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");


const serverConfig = {
    target: 'node',
    mode: 'production',
    name: 'server',
    entry: {
        server: './src/server/index.ts'
    },
    devtool: 'none',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {ecma: 8},
                    compress: {ecma: 5, warnings: false, inline: 2},
                    mangle: {safari10: true},
                    output: {ecma: 5, comments: false, ascii_only: true}
                },
                parallel: true,
                extractComments: false,
                // cache: true,
            })
        ],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "[name].js",
        publicPath: '/',
        clean: true,
    },
}

module.exports = merge(common, serverConfig);
