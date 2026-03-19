const express = require("express");
const router = express.Router();
const tasksRoutes = require("./routesHandler");

router.use("/todos",tasksRoutes);
module.exports = router;