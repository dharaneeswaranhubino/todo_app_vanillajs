const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");

router.get("/",controller.getAllTasks);
router.post("/",controller.createTask);
router.put("/:id",controller.updateTask);
router.delete("/:id",controller.deleteTask);
router.patch("/:id/:status",controller.updateStatus);

module.exports = router;