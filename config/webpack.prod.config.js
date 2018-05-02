const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        "./src/index.tsx"
    ],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        modules: [
            __dirname,
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    output: {
        path: __dirname + '/../dist/',
        filename: 'bundle.js',
        publicPath : 'dist'
    }

};
