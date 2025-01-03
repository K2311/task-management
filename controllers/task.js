const Joi = require('joi');
const Task = require('../models/Task');

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid('To Do', 'In Progress', 'Done').required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Low'),
    dueDate: Joi.date().required(),
    assignedTo: Joi.string().required()
});

let createTask = async (req, res) => {
    try {   
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const task = new Task(req.body);
        task.createdBy = req.user._id;
        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
   
}

let fetchTasks = async (req, res) => {
    try {
        let tasks;

        // Check user role
        if (req.user.role === 'Admin') {
            // Admin: Fetch all tasks
            tasks = await Task.find();
        } else {
            // Non-admin: Fetch tasks assigned to the user
            tasks = await Task.find({ assignedTo: req.user._id });
        }
        //const tasks = await Task.find({ assignedTo: req.user._id });
        res.status(200).json({ message: 'Tasks fetched successfully', tasks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

let updateTaskStatus  = async (req, res) => {
    try {
        const { taskId, status } = req.body;
        let tasks;

        // Check user role
        if (req.user.role === 'Admin') {
            // Admin: Fetch all tasks
             task = await Task.findOne({ 
                _id: taskId, 
            });
        } else {
            // Non-admin: Fetch tasks assigned to the user
             task = await Task.findOne({ 
                _id: taskId, 
                assignedTo: req.user._id 
            });
        }
        // const task = await Task.findOne({ 
        //     _id: taskId, 
        //     assignedTo: req.user._id 
        // });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.status = status;
        await task.save();

        const assignedUserId = task.assignedTo;
       
        if (req.io && req.userSockets[assignedUserId]) {
            req.io.to(req.userSockets[assignedUserId]).emit('taskUpdated', {
                message: `Task "${task.title}" has been updated to "${task.status}"`,
                taskId: task._id,
                status: task.status
            });
            console.log(`Notification sent to user ${assignedUserId}`);
        } else {
            console.log('Socket.io is not available or user is not connected');
        }

        res.status(200).json({ message: 'Task status updated successfully', task });
    } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' }); 
    }
}

let fetchTaskById  = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task fetched successfully', task });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

let deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // io.emit('taskDeleted', {
        //     message: `Task "${task.title}" has been deleted.`,
        //     taskId: task._id
        // });
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }

}


module.exports = {
    createTask,
    fetchTasks,
    updateTaskStatus,
    fetchTaskById,
    deleteTask
}