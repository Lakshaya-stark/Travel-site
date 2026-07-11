const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.set("query parser", "extended");
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Fail",
    message: `Can't Find ${req.originalUrl} on this server....`,
  });

  next();
});

module.exports = app;
