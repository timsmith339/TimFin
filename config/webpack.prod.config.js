const path = require('path');

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
    output: {
        path: __dirname + '/../dist/',
        filename: 'bundle.js',
        publicPath : './dist'
    }

};
