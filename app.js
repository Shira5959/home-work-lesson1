const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const booksRouter = require('./routes/books.route');
const userRouter = require('./routes/user.route');
const addCurrentDate = require('./middlewares/currentDate.middleware');
const printDateOnGet = require('./middlewares/printDate.middleware');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();
const port = 3000;

app.use(cors());
app.use(morgan('dev'));    

app.use(express.json());

app.use(addCurrentDate);
app.use(printDateOnGet);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/books', booksRouter);
app.use('/users', userRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});