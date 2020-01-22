const path = require('path');

module.exports = {
  entry: './src/main.js',
  mode: 'production',
  output: {
    filename: '<NAME>.js',
    path: path.resolve(__dirname)
  }
};
