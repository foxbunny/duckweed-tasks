/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

import path = require("path");

import HTMLWebpackPlugin = require("html-webpack-plugin");
import webpack = require("webpack");
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";

interface Env {
  [key: string]: string;
}

export default function(env: Env | void): webpack.Configuration {
  const commonPlugins = [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "static/index.html"),
    }),
  ];

  const plugins = process.env.NODE_ENV === "production"
    // Production plugins
    ? commonPlugins.concat([

    ])
    // Development plugins
    : commonPlugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ]);

  if (env && env.profile === "yes") {
    plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: "server",
    }));
  }

  return {
    devServer: {
      disableHostCheck: true,
      historyApiFallback: true,
      hot: true,
      overlay: true,
    },
    devtool: "source-map",
    entry: {
      shell: "./src",
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: [
            "ts-loader",
            "tslint-loader",
          ],
        },
        {
          test: /.styl$/,
          use: [
            {
              loader: "style-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                localIdentName: "[local]-[hash:base64:5]",
                modules: true,
                sourceMap: true,
              },
            },
            {
              loader: "stylus-loader",
            },
          ],
        },
      ],
    },
    output: {
      filename: "[name]-[hash:5].js",
      path: path.resolve(__dirname, "build"),
    },
    plugins,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: [
        path.resolve(__dirname, "src"),
        "node_modules",
      ],
    },
  };
}
