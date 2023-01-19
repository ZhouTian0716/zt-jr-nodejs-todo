const express = require("express");
const router = express.Router();
const {
  createOne,
  getAll,
  getById,
  updateById,
  deleteById,
} = require("../controllers/tasksController");

router.post("/", createOne);
router.get("/", getAll);

router
  .get("/:id", getById)
  .patch("/:id", updateById)
  .delete("/:id", deleteById);

module.exports = router;
