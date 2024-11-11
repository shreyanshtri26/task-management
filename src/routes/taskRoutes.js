const express = require('express');
const TaskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const router = express.Router();

router.post('/', auth, TaskController.createTask);
router.get('/', auth, TaskController.getTasks);
router.put('/:id', auth, TaskController.updateTask);
router.delete('/:id', auth, checkRole(['admin']), TaskController.deleteTask);

module.exports = router;