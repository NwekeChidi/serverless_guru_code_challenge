const express = require("express");

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/users", require("./routes/users"));

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports = app;