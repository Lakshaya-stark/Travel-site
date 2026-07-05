const app = require("./app");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB CONNECTED ");
  });

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Hello world",
  });
});

app.listen(port, () => {});
