const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?https://localhost:8080',
        'webpack/hot/only-dev-server',
        "./src/index.tsx"
    ],
    mode: 'development',
    devtool: 'eval',
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
        extensions: [ '.ts', '.tsx', '.js'],
    },
    output: {
        path: __dirname + '/../public/dist/',
        filename: 'bundle.js',
        publicPath : 'public/dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: 'Hot Module Replacement'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './public/',
        hot: true
      },

};
