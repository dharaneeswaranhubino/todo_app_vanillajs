const express = require("express");
const cors = require("cors");
const db = require("./app/config/db");
// tasksRoutes = require("./app/controllers/taskController");
const routes = require("./app/routes/indexRoute");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// const corsOptions = {
//   origin: "http://127.0.0.1:5500",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   allowedHeaders: ["Content-Type"]
// };

// app.options("/{*path}", cors(corsOptions));  // ← Handle preflight for ALL routes
// app.use(cors(corsOptions));           // ← Handle actual requests
// app.use("/api/todos",tasksRoutes);
app.use("/api", routes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: "Something went wrong",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = app;
