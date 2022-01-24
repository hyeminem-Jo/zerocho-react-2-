const path = require("path");
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "eval", 
  resolve: {
    extensions: [".jsx", ".js"],
  },

  entry: {
    app: ["./client"],
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      loader: "babel-loader",
      options: {
        presets: [
          ["@babel/preset-env", {
            targets: { 
              browsers: ['>1% in KR'],
            },
            debug: true,
          }],
          "@babel/preset-react"
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          'react-refresh/babel',
        ],
      },
    },],
  },
  plugins: [
    new RefreshWebpackPlugin()
  ],
  output: {
    filename: "app.js",
    path: path.join(__dirname, "dist"),
		publicPath: '/dist/',
  },

	// webpack-dev-server 
	// 빌드의 결과물을 돌린 다음 (publicPath 에 적은) dist 폴더에 그 결과물을 메모리로 저장해줌
	// 또한 변경점을 감지하는 기능이 있어 소스코드에 변경이 생길 때 이를 감지 후 결과물도 수정해줌.
	devServer: {
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: path.resolve(__dirname) },
    hot: true
  },
};