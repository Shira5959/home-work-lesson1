const express = require('express');
const booksRouter = require('./routes/books.route');
const userRouter = require('./routes/user.route');

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/books', booksRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});