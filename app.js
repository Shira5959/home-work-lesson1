const express = require('express');
const app = express();  

app.use(express.json());
const {books}=require("./db")
const port=3000
app.get('/', (req, res) => {
    res.send('Hello World!');
}   );

app.get('/books', (req, res) => {
    res.send(books);
});

app.get('/books/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const bookItem = books.find(b => b.code === code);
    if (bookItem) {
        res.send(bookItem);     
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/books',(req,res)=>{
    let bookToAdd=req.body
    if(!bookToAdd.name||!bookToAdd.category||!bookToAdd.price)
        res.status(400).json({message:"You need to enter all the details of the book."})
    else{
        if(!bookToAdd.isBorrowed)
             bookToAdd.isBorrowed=false
        let bookCode=books[books.length-1].code+1
        let newBook={code:bookCode, ...bookToAdd}
        books.push(newBook)
        res.status(201).json(books)
    }
})

app.put('/books/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const updatedBook = req.body;
    const index = books.findIndex(b => b.code === code); 
    if (index !== -1) {
        books[index] = { ...books[index], ...updatedBook };
        res.send(books[index]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

app.patch('/books/:code/borrow', (req, res) => {
    const code = parseInt(req.params.code);
    const { isBorrowed } = req.body;
    const index = books.findIndex(b => b.code === code);
    if (index !== -1) {
        books[index].isBorrowed = isBorrowed;
        res.send(books[index]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

app.patch('/books/:code/return', (req, res) => {
    const code = parseInt(req.params.code);
    const index = books.findIndex(b => b.code === code); 
    if (index !== -1) {
        books[index].isBorrowed = false;
        books[index].borrowedBy = null;
        res.send(books[index]);
    } else {    
    res.status(404).send({ message: 'Book not found' });
    }
}); 

app.delete('/books/:code', (req, res) => {
    const code = parseInt(req.params.code);
    const index = books.findIndex(b => b.code === code); 
    if (index !== -1) {
        const deletedBook = books.splice(index, 1);
        res.send(deletedBook[0]);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }});

