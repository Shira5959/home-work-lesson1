const { books } = require('../db');
const { users } = require('../users');

const getAll = (req, res) => {
    res.send(books);
};

const getByCode = (req, res, next) => {
    const code = parseInt(req.params.code);
    const bookItem = books.find(b => b.code === code);
    if (bookItem) {
        res.send(bookItem);
    } else {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
};

const add = (req, res, next) => {
    const bookToAdd = req.body;
    if (!bookToAdd.name || !bookToAdd.category || !bookToAdd.price) {
        const err = new Error('You need to enter all the details of the book.');
        err.status = 400;
        return next(err);
    }
    const bookCode = books.length ? books[books.length - 1].code + 1 : 1;
    const newBook = {
        code: bookCode,
        name: bookToAdd.name,
        category: bookToAdd.category,
        price: bookToAdd.price,
        isBorrowed: false,
        borrowedBy: null
    };
    books.push(newBook);
    res.status(201).json(newBook);
};

const update = (req, res, next) => {
    const code = parseInt(req.params.code);
    const index = books.findIndex(b => b.code === code);
    if (index !== -1) {
        books[index] = { ...books[index], ...req.body, code: books[index].code };
        res.send(books[index]);
    } else {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
};

const borrow = (req, res, next) => {
    const code = parseInt(req.params.code);
    const { userCode } = req.body;

    const book = books.find(b => b.code === code);
    if (!book) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }

    const user = users.find(u => u.code === userCode);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }

    if (book.isBorrowed) {
        const err = new Error('Book is already borrowed');
        err.status = 400;
        return next(err);
    }

    book.isBorrowed = true;
    book.borrowedBy = { date: new Date().toISOString().slice(0, 10), code: user.code };
    user.borrowedBooks.push(book.code);

    res.send(book);
};

const giveBack = (req, res, next) => {
    const code = parseInt(req.params.code);

    const book = books.find(b => b.code === code);
    if (!book) {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }

    if (!book.isBorrowed) {
        const err = new Error('Book is not borrowed');
        err.status = 400;
        return next(err);
    }

    const user = users.find(u => u.code === book.borrowedBy.code);
    if (user) {
        user.borrowedBooks = user.borrowedBooks.filter(c => c !== book.code);
    }

    book.isBorrowed = false;
    book.borrowedBy = null;

    res.send(book);
};

const remove = (req, res, next) => {
    const code = parseInt(req.params.code);
    const index = books.findIndex(b => b.code === code);
    if (index !== -1) {
        const deletedBook = books.splice(index, 1);
        res.send(deletedBook[0]);
    } else {
        const err = new Error('Book not found');
        err.status = 404;
        return next(err);
    }
};

module.exports = { getAll, getByCode, add, update, borrow, giveBack, remove };