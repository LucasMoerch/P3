const path = require('path');

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist/assets'),
        publicPath: '/assets/'
    },
    devServer: {
        static: [
            { directory: path.join(__dirname, 'public') },
            { directory: path.join(__dirname, 'dist') }
        ],
        port: 5173,
        historyApiFallback: true,
        // Webpack Dev Server v5 proxy format
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
            { test: /\.s?css$/, use: ['style-loader','css-loader','sass-loader'] }
        ]
    },
    resolve: { extensions: ['.ts', '.js'] }
};
