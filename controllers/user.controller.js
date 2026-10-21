const { users } = require('../users');

// פונקציית עזר: מחזירה משתמש בלי הסיסמה
const withoutPassword = (user) => {
    const { password, ...rest } = user;
    return rest;
};

const getAllUsers = (req, res) => {
    res.send(users.map(withoutPassword));
};

const signUp = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).send({ message: 'You need to enter username, email and password.' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).send({ message: 'Email already exists' });
    }
    const code = users.length ? users[users.length - 1].code + 1 : 1;
    const newUser = { code, username, email, password, borrowedBooks: [] };
    users.push(newUser);
    res.status(201).send(withoutPassword(newUser));
};

const login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).send({ message: 'Email or password is incorrect' });
    }
    res.send(withoutPassword(user));
};

module.exports = { getAllUsers, signUp, login };