const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        enum: ['American', 'Chinese', 'Indian'],
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

foodSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
// foodSchema.index({ "$**" : 'text'});

module.exports = mongoose.model('Food', foodSchema);