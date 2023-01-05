// webpack configuration file

const { readFileSync } = require('fs');
const { resolve } = require('path');
const path = require('path');
const { BannerPlugin } = require('webpack');

const header = readFileSync(resolve('./header.user.js')).toString();

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'neptune.user.js'
    },
    plugins: [
        new BannerPlugin({
            banner: header,
            raw: true
        })
    ]
}
