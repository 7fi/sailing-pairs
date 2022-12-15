const path = require('path')

module.exports = [
    {
        mode: 'development',
        // entry: {
        //     info: './info.js',
        //     client: './client.js',
        //     pairs: './pairs.js',
        // },
        entry: {
            pairs: './docs/entry.js',
            scores: './docs/entryScores.js',
        },
        // entry: ['./docs/info.js', './docs/client.js', './docs/pairs.js', './docs/scores2.js'],
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
        },
        watch: true,
    },
]
