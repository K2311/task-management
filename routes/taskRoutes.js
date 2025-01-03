const express = require('express');
const router = express.Router();
const task = require('../controllers/task');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

router.post('/', verifyToken, task.createTask);
router.get('/', verifyToken, task.fetchTasks);
router.patch('/updateTaskStatus', verifyToken, task.updateTaskStatus);
router.get('/:id', verifyToken, task.fetchTaskById);
router.delete('/:id', verifyToken,verifyRole('Admin'), task.deleteTask);



module.exports = router;
