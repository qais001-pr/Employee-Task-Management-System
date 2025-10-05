const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');

// Routes
router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
