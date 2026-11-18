const jwt = require('jsonwebtoken');

const createError = (message, status) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const checkAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next(createError('No token provided', 401));
    }
    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return next(createError('Invalid or expired token', 401));
    }
};

const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(createError('Admin access required', 403));
    }
    next();
};

module.exports = { checkAuth, checkAdmin };