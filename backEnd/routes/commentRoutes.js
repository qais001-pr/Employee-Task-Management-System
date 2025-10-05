const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');

// GET all comments
router.get('/', commentController.getAllComments);

// GET comments by Task ID
router.get('/task/:taskId', commentController.getCommentsByTask);

// GET comments by Employee ID
router.get('/employee/:employeeId', commentController.getCommentsByEmployee);

// CREATE a new comment
router.post('/', commentController.addComment);

// UPDATE a comment
router.put('/:id', commentController.updateComment);

// DELETE a comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;
