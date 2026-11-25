const mongoose = require('mongoose');
const Joi = require('joi');

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
    },
    image: String
});

const createBookJoi = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    price: Joi.number().min(0).required(),
    categories: Joi.array().items(Joi.string().trim().min(2)).min(1).required(),
    supplier: Joi.object({
        name: Joi.string().min(2),
        phone: Joi.string().pattern(/^0(5\d|7\d|[2-4]|[8-9])-?\d{7}$/),
        email: Joi.string().email()
    })
});

const bookJoi = {
    create: createBookJoi,
    update: createBookJoi
        .fork(['name', 'price', 'categories'], (field) => field.optional())
        .min(1)
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
module.exports.bookJoi = bookJoi;