const { users } = require('../users');

const withoutPassword = (user) => {
    const { password, ...rest } = user;
    return rest;
};

const getAllUsers = (req, res, next) => {
    if (users.length === 0) {
        const err = new Error('No users found');
        err.status = 404;
        return next(err);
    }
    res.send(users.map(withoutPassword));
};

const signUp = (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        const err = new Error('You need to enter username, email and password.');
        err.status = 400;
        return next(err);
    }
    if (users.find(u => u.email === email)) {
        const err = new Error('Email already exists');
        err.status = 400;
        return next(err);
    }
    const code = users.length ? users[users.length - 1].code + 1 : 1;
    const newUser = { code, username, email, password, borrowedBooks: [] };
    users.push(newUser);
    res.status(201).send(withoutPassword(newUser));
};

const login = (req, res, next) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        const err = new Error('Email or password is incorrect');
        err.status = 401;
        return next(err);
    }
    res.send(withoutPassword(user));
};

module.exports = { getAllUsers, signUp, login };