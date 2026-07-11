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
  //   res.status(404).json({
  //     status: "Fail",
  //     message: `Can't Find ${req.originalUrl} on this server....`,
  //   });

  const err = new Error(`Can't Find ${req.originalUrl} on This Server...`);
  err.statusCode = 404;
  err.status = "Failed";

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  next();
});

module.exports = app;
