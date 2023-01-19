const express = require("express");
const router = express.Router();
const {
  createOne,
  getAll,
  getById,
  updateById,
  deleteById,
} = require("../controllers/tasksController");

router.post("/", createOne).get("/", getAll);

router.get("/:id", getById).put("/:id", updateById).delete("/:id", deleteById);

module.exports = router;
