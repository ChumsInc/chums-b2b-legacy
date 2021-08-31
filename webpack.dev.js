const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path');

const localProxy = {
    target: 'http://localhost:8081',
    // ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        historyApiFallback: true,
        static: [path.join(__dirname, 'public'), __dirname],
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
    devtool: 'eval-source-map',
    plugins: []
});
