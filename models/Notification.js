const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    type: {
        type: String,
        enum:["email", "real-time"], 
        default: 'email'
    }
},
{
    timestamps: true
});

const Notification = mongoose.model('Notification', Schema);
module.exports = Notification;