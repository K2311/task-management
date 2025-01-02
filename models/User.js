const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:["Admin", "User"], 
        default: 'User'
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', Schema);

module.exports = User;
