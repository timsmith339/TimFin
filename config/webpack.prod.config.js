const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: [
        "./src/index.tsx"
    ],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts|.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
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
    plugins: [
        new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '..') }),
        new UglifyJsPlugin()
    ],
    output: {
        path: __dirname + '/../dist/',
        filename: 'bundle.js',
        publicPath : './dist'
    }

};
