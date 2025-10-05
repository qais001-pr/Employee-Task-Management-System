const express = require('express');
const router = express.Router();
const projectController = require('../controller/projectController');

// GET all projects
router.get('/', projectController.getProjects);

// GET project by ID
router.get('/:id', projectController.getProjectById);

// CREATE project
router.post('/', projectController.createProject);

// UPDATE project
router.put('/:id', projectController.updateProject);

// DELETE project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
