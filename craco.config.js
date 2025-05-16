const webpack = require('webpack');

module.exports = {
    webpack: {
        plugins: {
            add: [
                // ProvidePlugin to polyfill 'process'
                new webpack.ProvidePlugin({
                    process: 'process/browser',
                }),
                // Other plugins can be added here if needed
            ],
            // Remove plugins if necessary
            remove: [],
        },
        configure: (webpackConfig, { env, paths }) => {
            // Add fallbacks for Node.js modules in the browser
            webpackConfig.resolve = {
                ...webpackConfig.resolve,
                fallback: {
                    fs: false,
                    path: require.resolve('path-browserify'),
                    os: require.resolve('os-browserify'),
                    crypto: false, // Or require.resolve('crypto-browserify') if needed
                },
            };

            // Other webpack configurations
            // ...

            return webpackConfig;
        },
    },
    // Configuration for the development server
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        allowedHosts: 'all',
        port: 3000, // Customize the port if needed
    },
    // Other CRACO configurations
    // ...
};
