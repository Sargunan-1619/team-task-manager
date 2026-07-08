const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  updateStatus,
  deleteTask,
} = require("../controllers/taskcontroller");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.patch("/:id", protect, updateTask);
router.patch("/:id/status", protect, updateStatus);
router.delete("/:id", protect, deleteTask);

module.exports = router;