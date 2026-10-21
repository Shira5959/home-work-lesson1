const { books } = require('../db');
const { users } = require('../users');

const getAll = (req, res) => {
    res.send(books);
};

const getByCode = (req, res) => {
    const code = parseInt(req.params.code);
    const bookItem = books.find(b => b.code === code);
    if (bookItem) {
        res.send(bookItem);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
};

const add = (req, res) => {
    const bookToAdd = req.body;
    if (!bookToAdd.name || !bookToAdd.category || !bookToAdd.price) {
        return res.status(400).json({ message: 'You need to enter all the details of the book.' });
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

const update = (req, res) => {
    const code = parseInt(req.params.code);
    const index = books.findIndex(b => b.code === code);
    if (index !== -1) {
        books[index] = { ...books[index], ...req.body, code: books[index].code };
        res.send(books[index]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
};

const borrow = (req, res) => {
    const code = parseInt(req.params.code);
    const { userCode } = req.body;

    const book = books.find(b => b.code === code);
    if (!book) return res.status(404).send({ message: 'Book not found' });

    const user = users.find(u => u.code === userCode);
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (book.isBorrowed) {
        return res.status(400).send({ message: 'Book is already borrowed' });
    }

    book.isBorrowed = true;
    book.borrowedBy = { date: new Date().toISOString().slice(0, 10), code: user.code };
    user.borrowedBooks.push(book.code);

    res.send(book);
};

const giveBack = (req, res) => {
    const code = parseInt(req.params.code);

    const book = books.find(b => b.code === code);
    if (!book) return res.status(404).send({ message: 'Book not found' });

    if (!book.isBorrowed) {
        return res.status(400).send({ message: 'Book is not borrowed' });
    }

    const user = users.find(u => u.code === book.borrowedBy.code);
    if (user) {
        user.borrowedBooks = user.borrowedBooks.filter(c => c !== book.code);
    }

    book.isBorrowed = false;
    book.borrowedBy = null;

    res.send(book);
};

const remove = (req, res) => {
    const code = parseInt(req.params.code);
    const index = books.findIndex(b => b.code === code);
    if (index !== -1) {
        const deletedBook = books.splice(index, 1);
        res.send(deletedBook[0]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
};

module.exports = { getAll, getByCode, add, update, borrow, giveBack, remove };