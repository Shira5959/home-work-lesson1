const express = require('express');
const app = express();  

app.use(express.json());
const {books,borrowings}=require("./db")
const port=3000
app.get('/', (req, res) => {
    res.send('Hello World!');
}   );

app.get('/books', (req, res) => {
    res.send(book);
});

app.get('/books/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const bookItem = book.find(b => b.code === code);
    if (bookItem) {
        res.send(bookItem);     
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

app.post('/books',(req,res)=>{
    let bookToAdd=req.body
    if(!bookToAdd.name||!bookToAdd.category||!bookToAdd.price)
        res.status(400).json({message:"You need to enter all the details of the book."})
    else{
        if(!bookToAdd.IsBorrowed)
            bookToAdd.IsBorrowed=false
        let bookId=books[books.length-1].id+1
        let newBook={id:bookId, ...bookToAdd}
        books.push(newBook)
        res.status(201).json(books)
    }
})

app.put('/books/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const updatedBook = req.body;
    const index = book.findIndex(b => b.code === code); 
    if (index !== -1) {
        book[index] = { ...book[index], ...updatedBook };
        res.send(book[index]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

app.patch('/books/:code/borrow', (req, res) => {
    const code = parseInt(req.params.code);
    const { borrowed } = req.body;
    const index = book.findIndex(b => b.code === code);
    if (index !== -1) {
        book[index].borrowed = borrowed;
        res.send(book[index]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

app.patch('/books/:code/return', (req, res) => {
    const code = parseInt(req.params.code);
    const index = book.findIndex(b => b.code === code); 
    if (index !== -1) {
        book[index].isBorrowed = false;
        book[index].borrowedBy = null;
        res.send(book[index]);
    } else {    
    res.status(404).send({ message: 'Book not found' });
    }
}); 

app.delete('/books/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const index = book.findIndex(b => b.code === code); 
    if (index !== -1) {
        const deletedBook = book.splice(index, 1);
        res.send(deletedBook[0]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }});

