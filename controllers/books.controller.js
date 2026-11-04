const Book = require('../models/book.model');

const getAll = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.send(books);
    } catch (err) {
        next(err);
    }
};

const getById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.send(book);
    } catch (err) {
        if (err.name === 'CastError') err.status = 400;
        next(err);
    }
};

const add = async (req, res, next) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).send(newBook);
    } catch (err) {
        if (err.name === 'ValidationError') err.status = 400;
        next(err);
    }
};

const update = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.send(book);
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'ValidationError') err.status = 400;
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            const err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        res.send(book);
    } catch (err) {
        if (err.name === 'CastError') err.status = 400;
        next(err);
    }
};

module.exports = { getAll, getById, add, update, remove };