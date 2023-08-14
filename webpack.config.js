const path = require('path');
const webpack = require('webpack');
/* Vue采用的是Rollup进行的打包 */

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "Vue.js"
    },
    mode: "development",
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [{
                test: /\.js/,
                use: {
                    loader: "babel-loader",
                    // options: {
                    //     presets: ['@babel/preset-env', {
                    //         target: {
                    //             edge: "17",
                    //             firefox: "60",
                    //             chrome: "67",
                    //             safari: "11.1"
                    //         },
                    //         corejs: 2,
                    //         useBuiltIns: "usage"
                    //     }]
                    // }
                }
            },
            {
                test: /\.ts/,
                use: {
                    loader: "ts-loader",
                    options: {}
                }
            }
        ]
    },
    devServer:{
        port:3000,
        hot:true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
}