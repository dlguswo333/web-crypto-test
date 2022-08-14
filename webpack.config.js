const path = require('path');
const process = require('process')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const development = !!process.env.NODE_ENV;

console.log(`Webpack building in ${development ? 'development' : 'production'}`)

module.exports = {
  entry: __dirname + '/src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/build')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  mode: development ? 'development' : 'production',
  devtool: development ? 'inline-source-map' : false,
  devServer: {
    liveReload: true,
    hot: true,
    watchFiles: ['src/**/*'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
};
