const Task = require('../models/Task');

class TaskService {
  static async createTask(taskData, userId) {
    const task = new Task({
      ...taskData,
      createdBy: userId,
      updatedBy: userId,
    });
    await task.save();
    return task.populate('assignees createdBy');
  }

  static async getTasks(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .populate('assignees createdBy')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Task.countDocuments(query);
    return {
      tasks,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  }

  static async updateTask(taskId, updates, userId) {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...updates, updatedBy: userId },
      { new: true }
    ).populate('assignees createdBy');
    return task;
  }

  static async deleteTask(taskId) {
    await Task.findByIdAndDelete(taskId);
  }
}

module.exports = TaskService;