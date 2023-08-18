const path = require('path');
const webpack = require('webpack');
/* Vue采用的是Rollup进行的打包 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');


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
    devServer: {
        port: 3000,
        hot: true,
        open: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
        })
    ]
}