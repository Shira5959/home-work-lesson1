const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        match: [/^0(5\d|7\d|[2-4]|[8-9])-?\d{7}$/, 'Invalid Israeli phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    borrows: [{
        code: String,
        name: String
    }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.statics.checkLogin = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
};

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

const phonePattern = /^0(5\d|7\d|[2-4]|[8-9])-?\d{7}$/;

const userJoi = {
    register: Joi.object({
        name: Joi.string().trim().min(2).max(50).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(phonePattern).required(),
        password: Joi.string().min(4).required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    update: Joi.object({
        name: Joi.string().trim().min(2).max(50),
        email: Joi.string().email(),
        phone: Joi.string().pattern(phonePattern)
    }).min(1),
    borrow: Joi.object({
        bookId: Joi.string().hex().length(24).required()
    })
};

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.userJoi = userJoi;