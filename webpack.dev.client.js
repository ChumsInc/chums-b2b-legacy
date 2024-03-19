const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const webpack = require('webpack');

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
            logging: 'log',
            overlay: {
                runtimeErrors: (error) => {
                    console.log(error);
                    if (error instanceof DOMException && error.name === 'ResizeObserver') {
                        return true;
                    }
                    return false;
                }
            }
        },
        historyApiFallback: true,
        static: [
            {
                directory: path.join(__dirname, 'public'),
                watch: false,
            },
            {
                directory: path.join(__dirname),
                watch: false,
            }
        ],
        hot: true,
        proxy: [
            {
                context: ['/api', '/images', '/pdf', '/files', '/node_modules', '/node-sage', '/sage', '/version'],
                ...localProxy
            }
        ],
        watchFiles: 'src/**/*',
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
    ],
}

module.exports = merge(common, clientConfig);
