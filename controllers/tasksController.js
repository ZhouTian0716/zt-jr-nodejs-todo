// ID use uuid OR timestamp?
// uuid or Date.now()

// 修改本地data
// const { v4: uuid } = require("uuid");
const fsPromises = require("fs").promises;
const path = require("path");

const data = {
  tasks: require("../model/tasks.json"),
  setTasks: function (data) {
    this.tasks = data;
  },
};

const createOne = async (req, res) => {
  if (!req.body.description) {
    return res
      .status(400)
      .json({ message: "Task description field required." });
  }

  const newTask = {
    id: Date.now(),
    // id: uuid(),
    description: req.body.description,
    done: false,
  };

  const queryResult = data.tasks;
  queryResult.unshift(newTask);
  data.setTasks(queryResult);
  // data.setTasks([...data.tasks, newTask]);
  // 更新本地data
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "tasks.json"),
      JSON.stringify(queryResult)
    );
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// allow query for getAll
const getAll = (req, res) => {
  if (req.query) {
    // 笔记：queryResult这里我一开始用const了
    let queryResult = data.tasks;
    // Step 1, 对queryResult进行筛选
    if (req.query.description) {
      const keyword = req.query.description;
      // GOOD EXAMPLE OF indexOf method!
      // filter the queryResult
      const filtedTasks = queryResult.filter(
        (e) => e.description.indexOf(keyword) !== -1
      );
      queryResult = [...filtedTasks];
    }
    // Step 2, 对queryResult进行排序
    switch (req.query.order) {
      case "new":
        const descending = queryResult.sort((a, b) => {
          if (a.id < b.id) return 1;
          if (a.id > b.id) return -1;
          return 0;
        });
        queryResult = [...descending];
        break;
      case "old":
        const ascending = queryResult.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        queryResult = [...ascending];
        break;
      default:
        break;
    }
    res.status(200).json(queryResult);
  } else {
    res.status(200).json(data.tasks);
  }
};

const getById = (req, res) => {
  const task = data.tasks.find((e) => e.id === parseInt(req.params.id));
  if (!task) {
    return res
      .status(400)
      .json({ message: `Task ID ${req.params.id} not found` });
  }
  res.status(200).json(task);
};

const updateById = async (req, res) => {
  const task = data.tasks.find((e) => e.id === parseInt(req.params.id));
  const taskIndex = data.tasks.findIndex((e) => e.id === parseInt(req.params.id));
  if (!task) {
    return res
      .status(400)
      .json({ message: `Task ID ${req.params.id} not found` });
  }

  const updatedTask = {
    id:task.id,
    done: req.body.done,
    description: req.body.description,
  };
  // 替换目标task
  data.tasks[taskIndex] = updatedTask;

  // 更新本地data
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "tasks.json"),
      JSON.stringify(data.tasks)
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.status(200).json(updatedTask);
};

const deleteById = async (req, res) => {
  const task = data.tasks.find((e) => e.id === parseInt(req.params.id));
  if (!task) {
    return res
      .status(400)
      .json({ message: `Task ID ${req.body.id} not found` });
  }
  const filteredArray = data.tasks.filter(
    (e) => e.id !== parseInt(req.params.id)
  );
  // 更新本地data
  try {
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "tasks.json"),
      JSON.stringify(filteredArray)
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.status(200).json({ message: `(Deleted) Task: ${task.description}` });
};

module.exports = {
  createOne,
  getAll,
  getById,
  updateById,
  deleteById,
};
