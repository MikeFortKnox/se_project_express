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

const routes = require("./routes");

app.use(express.json());
app.use("/", mainRouter);
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`);
});
