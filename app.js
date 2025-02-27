const cors = require("cors");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const { errors } = require("celebrate");
const { login, createUser } = require("./controllers/users"); // Adjust the path as necessary
const errorHandler = require("./middleware/error-handler");
const { requestLogger, errorLogger } = require("./middleware/logger");

const app = express();

app.use(cors());

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Define routes
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", router);
app.use(errors());
app.use(errorHandler);

// Start the server
const { PORT = 3001 } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
