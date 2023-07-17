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
        client: [
            './src/client/index.tsx',
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
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
        },
        watchFiles: 'src/**/*',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
}

module.exports = merge(common, clientConfig);
