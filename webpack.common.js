const webpack = require('webpack');
const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                ],
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
                chums: {
                    test: /[\\/]common-components[\\/]/,
                    name: 'chums',
                    chunks: 'all',
                },
            }
        }
    },
    output: {
        path: path.join(__dirname, 'public/build'),
        filename: "[name].js",
        sourceMapFilename: '[file].map',
        publicPath: '/',
    },
    target: 'web',
}
