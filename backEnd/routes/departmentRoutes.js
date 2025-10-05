const express = require('express');
const router = express.Router();
const departmentController = require('../controller/departmentController');

// GET all departments
router.get('/', departmentController.getDepartments);

// GET department by ID
router.get('/:id', departmentController.getDepartmentById);

// CREATE department
router.post('/', departmentController.createDepartment);

// UPDATE department
router.put('/:id', departmentController.updateDepartment);

// DELETE department
router.delete('/:id', departmentController.deleteDepartment);

module.exports = router;
