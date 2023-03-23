const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        host: path.resolve(__dirname, 'src/host'),
        guest: path.resolve(__dirname, 'src/guest'),
    },
    output: {
        filename: 'assets/js/[name].bundle.js',
        chunkFilename: 'assets/js/[name].chunk.js',
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/host.html'),
            filename: 'host.html',
            inject: 'body',
            chunks: ['host'],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/guest.html'),
            filename: 'guest.html',
            inject: 'body',
            chunks: ['guest'],
        }),
    ],
};
