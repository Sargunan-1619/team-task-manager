const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectcontroller");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.patch("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;