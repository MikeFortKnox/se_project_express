const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DataBase");
  })
  .catch(console.error);

// const routes = require("./routes");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
