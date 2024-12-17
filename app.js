const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const { login, createUser } = require("./controllers/users"); // Adjust the path as necessary

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

// Define routes
app.post("/signin", login);
app.post("/signup", createUser);
app.use("/", router);

// Start the server
const { PORT = 3001 } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
