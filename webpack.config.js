const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: "./app/main.js",
  mode: isDev ? 'development' : 'production',
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  devtool: "source-maps",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      }
    ]
  }
};
