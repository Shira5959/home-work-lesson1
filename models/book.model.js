const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    categories: [String],
    supplier: {
        name: String,
        phone: String,
        email: String
    }
});

module.exports = mongoose.model('Book', bookSchema);