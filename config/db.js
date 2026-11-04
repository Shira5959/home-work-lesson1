const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGO_URI = "mongodb://localhost:27017/LibraryDB";   
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error(err.message);
    }
};

module.exports = connectDB;