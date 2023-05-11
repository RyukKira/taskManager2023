const Task = require("../models/task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({});
  res.status(StatusCodes.OK).json({ tasks });
});

const createTask = asyncWrapper(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });

  if (!task) {
    return next(
      createCustomError(
        `No task with this id: ${taskID}`,
        StatusCodes.NOT_FOUND,
      ),
    );
  }

  res.status(StatusCodes.OK).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOneAndDelete({ _id: taskID });

  if (!task) {
    return next(
      createCustomError(
        `No task with this id: ${taskID}`,
        StatusCodes.NOT_FOUND,
      ),
    );
  }

  res.status(StatusCodes.OK).json({ task });
});

const updateTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;

  const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(
      createCustomError(
        `No task with this id: ${taskID}`,
        StatusCodes.NOT_FOUND,
      ),
    );
  }
  res.status(StatusCodes.OK).json({ task });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
