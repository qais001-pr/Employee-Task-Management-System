const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// GET all tasks
router.get('/', taskController.getTasks);

// GET task by ID
router.get('/:id', taskController.getTaskById);

// CREATE task
router.post('/', taskController.createTask);

// UPDATE task
router.put('/:id', taskController.updateTask);

// DELETE task
router.delete('/:id', taskController.deleteTask);

// FILTER by employee, project, or status
router.get('/filter/:filterType/:filterValue', taskController.filterTasks);

module.exports = router;
