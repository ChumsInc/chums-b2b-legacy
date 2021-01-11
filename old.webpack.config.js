/**
 * Created by steve on 12/2/2016.
 */
const webpack = require('webpack');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
let args = process.argv;

let production = false;
let useProxy = true;

if (args.indexOf('-p') > -1) {
    console.log('*** building in production mode ***');
    production = true;
    useProxy = false;
}
if (!production && args.indexOf('--watch') === -1) {
    console.log('*** building in dev mode ***');
    useProxy = false;
}

const localProxy = {
    target: {
        host: 'localhost',
        protocol: 'http:',
        port: 8081
    },
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

const config = {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : "eval-source-map",
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: "[name].[contenthash].js",
        sourceMapFilename: '[file].map',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [{loader: 'style-loader'}, {loader: 'css-loader'}]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ManifestPlugin(),
        new BundleAnalyzerPlugin(),
    ],
    target: 'web',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        }
    }
};

if (!production) {
    config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin(),
    ];
    // config.output.filename = 'bundle.js';
}

if (!production && useProxy) {
    config.output.filename = 'bundle.js';
    config.devServer = {
        contentBase: path.join(__dirname, '/public'),
        // hot: true,
        proxy: {
            '/api': {...localProxy},
            '/images/': {...localProxy},
            '/pdf/': {...localProxy},
            '/files/': {...localProxy},
            '/node_modules/': {...localProxy},
            '/node-chums/': {...localProxy},
            '/node-dev/': {...localProxy},
            '/node-sage/': {...localProxy},
            '/sage/': {...localProxy},
            '/version': {...localProxy},
        }
    };
}

if (!useProxy && !production) {
    // building for dev mode from server
    config.plugins = [
        new ManifestPlugin({fileName: 'dev-manifest.json'}),
    ];
}

module.exports = config;
