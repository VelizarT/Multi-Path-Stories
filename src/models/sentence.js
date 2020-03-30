const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Sentence = mongoose.model('Sentence', {
    content: {
        type: String,
        required: true
    },
    node: {
        type: Number,
        min: 0,
        max: 4
    },
    origin: {
        type: Schema.Types.ObjectId
    },
    start: {
        type: Boolean
    }
});

module.exports = Sentence;