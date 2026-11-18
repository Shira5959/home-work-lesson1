const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Book = require('../models/book.model');

const createError = (message, status) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
    );
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        next(err);
    }
};

const signUp = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        const user = new User({ name, email, phone, password });
        await user.save();
        res.status(201).send({ user, token: generateToken(user) });
    } catch (err) {
        if (err.code === 11000) {
            return next(createError('Email already exists', 400));
        }
        if (err.name === 'ValidationError') err.status = 400;
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.checkLogin(email, password);
        if (!user) return next(createError('Email or password is incorrect', 401));
        res.send({ user, token: generateToken(user) });
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return next(createError('You can only update your own user', 403));
        }
        const user = await User.findById(id);
        if (!user) return next(createError('User not found', 404));

        const { name, email, phone } = req.body;
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;

        await user.save();
        res.send(user);
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'ValidationError') err.status = 400;
        if (err.code === 11000) err.status = 400;
        next(err);
    }
};

const borrowBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return next(createError('You can only borrow for yourself', 403));
        }
        const user = await User.findById(id);
        if (!user) return next(createError('User not found', 404));

        const book = await Book.findById(req.body.bookId);
        if (!book) return next(createError('Book not found', 404));

        user.borrows.push({ code: book.id, name: book.name });
        await user.save();
        res.send(user);
    } catch (err) {
        if (err.name === 'CastError') err.status = 400;
        next(err);
    }
};

module.exports = { getAllUsers, signUp, login, updateUser, borrowBook };