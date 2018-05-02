const path = require('path');

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
        path: __dirname + '../public/dist',
        filename: 'bundle.js',
        publicPath : 'public/dist'
    }
};
