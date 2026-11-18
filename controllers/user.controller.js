const User = require('../models/user.model');

const createError = (message, status) => {
    const err = new Error(message);
    err.status = status;
    return err;
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
        res.status(201).send(user);
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
        res.send(user);
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllUsers, signUp, login };