const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:["To Do", "In Progress", "Done"], 
        default: 'To Do'
    },
    priority: {
        type: String,
        enum:["Low", "Medium", "High"], 
        default: 'Low'
    },
    dueDate: {
        type: Date,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
});

const Task = mongoose.model('Task', Schema);

module.exports = Task;