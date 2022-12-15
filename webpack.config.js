const path = require('path')

module.exports = {
    mode: 'development',
    entry: './docs/client.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    watch: true,
}
