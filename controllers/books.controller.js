const { books } = require('../db');
const { users } = require('../users');
const getByCode = (req, res) => {
    const code = parseInt(req.params.code);
    const bookItem = books.find(b => b.code === code);
    if (bookItem) {
        res.send(bookItem);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
};