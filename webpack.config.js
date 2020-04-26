const env = require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


/** @type import('webpack').Configuration */
const config = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.(jgpe?g|png|gif|mp3|wav|ogg)$/,
        loader: 'file-loader'
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": Object.entries(env.parsed).reduce((acc, [key, value]) => {
        acc[key] = JSON.stringify(value)
        return acc
      }, {})
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'Open Hotel',
      favicon: './public/favicon.ico',
      template: './public/index.html',
    }),
  ],
  devServer: {
    contentBase: './public',
  },
  externals: {
    // 'pixi.js-legacy': 'PIXI'
  }
}

module.exports = config
