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

const b2bProxy = {
    target: 'https://b2b.chums.com',
    changeOrigin: true,
}

module.exports = merge(common, {
    mode: 'development',
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
        proxy: [
            {context: ['/images', '/pdf', '/files'], ...b2bProxy},
            {context: ['/api', '/node-sage', '/sage', '/version'], ...localProxy},
        ],
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
});
