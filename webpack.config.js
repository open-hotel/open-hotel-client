const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'app.js',
    chunkFilename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: 'public',
        toType: 'dir',
        ignore: ['.DS_Store'],
      },
    ]),
  ],
  externals: [
    // Don't bundle pixi.js, assume it'll be included in the HTML via a script
    // tag, and made available in the global variable PIXI.
    { 'pixi.js': 'PIXI' },
    { webfont: 'WebFont' },
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // devtool: false,
  devtool: 'inline-source-map',
  devServer: {
    contentBase: __dirname,
    inline: true,
    host: '0.0.0.0',
    port: 8080,
  },
}
