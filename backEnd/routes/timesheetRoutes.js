const express = require('express');
const router = express.Router();
const timesheetController = require('../controller/timesheetController');

// GET all timesheets
router.get('/', timesheetController.getAllTimesheets);

// GET timesheet by employee ID
router.get('/employee/:employeeId', timesheetController.getTimesheetsByEmployee);

// GET timesheet by task ID
router.get('/task/:taskId', timesheetController.getTimesheetsByTask);

// CREATE a new timesheet entry
router.post('/', timesheetController.createTimesheet);

// UPDATE timesheet record (hours or remarks)
router.put('/:id', timesheetController.updateTimesheet);

// DELETE timesheet record
router.delete('/:id', timesheetController.deleteTimesheet);

module.exports = router;
