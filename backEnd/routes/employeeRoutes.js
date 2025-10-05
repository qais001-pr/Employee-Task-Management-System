const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');

// Public routes
router.post('/login', employeeController.loginEmployee);
router.post('/', employeeController.createEmployee);

// Protected routes
router.get('/', employeeController.getEmployees);

router.get('/:id', employeeController.getEmployeeById);

router.put('/:id', employeeController.updateEmployee);

router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
