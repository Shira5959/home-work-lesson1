const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Book name is required'],
        trim: true,
        minlength: [2, 'Book name must be at least 2 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    categories: {
        type: [{ type: String, trim: true, minlength: [2, 'Category must be at least 2 characters'] }],
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one category is required'
        }
    },
    supplier: {
        name: String,
        phone: String,
        email: String
    }
});

module.exports = mongoose.model('Book', bookSchema);