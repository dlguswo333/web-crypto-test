const path = require('path');
const process = require('process')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const development = process.env.DEVELOPMENT ? !!Number(process.env.DEVELOPMENT) : true;
console.log(`Webpack building in ${development ? 'development' : 'production'}`)

module.exports = {
  entry: __dirname + '/src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/dist'),
    clean: true,
    assetModuleFilename: '[hash][ext]'
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
      {
        test: /\.(jpe?g|png)$/,
        type: 'asset/resource',
      },
      {
        // NOTE html-loader changes src of img autoMAGICally when building.
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: 'auto',
    }),
  ],
};
