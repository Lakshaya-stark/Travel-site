const express = require("express");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const appError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.set("query parser", "extended");
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new appError(`Can't Find ${req.originalUrl} on This Server...`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
