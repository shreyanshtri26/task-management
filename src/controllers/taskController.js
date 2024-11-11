const TaskService = require('../services/taskService');
const Joi = require('joi');

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  dueDate: Joi.date().required(),
  assignees: Joi.array().items(Joi.string()),
  status: Joi.string().valid('completed', 'incomplete').default('incomplete'),
});

class TaskController {
  static async createTask(req, res) {
    try {
      const { error } = taskSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const task = await TaskService.createTask(req.body, req.user._id);
      req.io.emit('taskCreated', task);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getTasks(req, res) {
    try {
      const { page = 1, limit = 10, status, priority, assignee } = req.query;
      const query = {};

      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (assignee) query.assignees = assignee;

      const result = await TaskService.getTasks(query, parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const { error } = taskSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const task = await TaskService.updateTask(req.params.id, req.body, req.user._id);
      req.io.emit('taskUpdated', task);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      await TaskService.deleteTask(req.params.id);
      req.io.emit('taskDeleted', req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = TaskController;