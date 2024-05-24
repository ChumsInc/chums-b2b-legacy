const {merge} = require('webpack-merge');
const common = require('./webpack.common.cjs');
const path = require('path');
const webpack = require('webpack');

process.traceDeprecation = true;

const localProxy = {
    target: 'http://localhost:8081',
    // ignorePath: false,
    changeOrigin: true,
    secure: false,
};

const clientConfig = {
    target: 'web',
    mode: 'development',
    entry: {
        main: [
            './src/client/index.tsx',
        ],
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        compress: true,
        client: {
            // logging: 'warn',
            overlay: {
                runtimeErrors: (error) => {
                    console.log(error);
                    return error instanceof DOMException && error.name === 'ResizeObserver';

                }
            }
        },
        historyApiFallback: true,
        static: [
            {directory: path.join(__dirname, 'public'), watch: false},
            {directory: path.join(__dirname), watch: false}
        ],
        hot: true,
        proxy: [
            {
                context: ['/api', '/node_modules', '/node-sage', '/sage', '/version'],
                ...localProxy
            },
            {
                context: ['/images', '/pdf', '/files'],
                target: 'https://b2b.chums.com',
                changeOrigin: true,
                secure: true
            }
        ],
        watchFiles: 'src/**/*',
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
    ],
    stats: {
        errorDetails: true,
    }
}

module.exports = merge(common, clientConfig);
