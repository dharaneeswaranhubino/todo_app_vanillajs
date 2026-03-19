const service = require("../services/taskService");

exports.getAllTasks = async (req, res, next) => {
  try {
    // const {status}= req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const status = req.query.status || "";
    const task = await service.getAllTaskList(status, page, limit);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { tasks } = req.body;
    if (!tasks) {
      return res.status(400).json({
        error: "Missing require fields : tasks",
      });
    }

    const newTask = await service.addTasks(req.body);
    res.status(201).json({
      message: "New Task Added",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const [result] = await service.editTask(req.body, req.params.id);
    if (result.affectedRows == 0) {
      return res.status(404).json({
        error: `Task Not Found for th given id ${req.params.id}`,
      });
    }
    res.json({
      message: `Task updated successfully`,
      task: result,
    });
    console.log("edited");
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const [taskId] = await service.deleteTasks(req.params.id);
    if (taskId.affectedRows == 0) {
      return res.status(404).json({
        message: `Data not found for the given id ${req.params.id}`,
      });
    }
    res.json(`task delete successfully`);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const result = await service.updateTaskStatus(id, status);
    res.json({ message: "Status Updated" });
  } catch (err) {
    next(err);
  }
};
