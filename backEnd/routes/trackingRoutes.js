const express = require('express');
const router = express.Router();
const trackingController = require('../controller/trackingController');

// GET all tracking entries
router.get('/', trackingController.getAllTracking);

// GET tracking by task ID
router.get('/task/:taskId', trackingController.getTrackingByTaskId);

// CREATE tracking record (update progress)
router.post('/', trackingController.createTracking);

// DELETE tracking record
router.delete('/:id', trackingController.deleteTracking);

module.exports = router;
