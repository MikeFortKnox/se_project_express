const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = async (req, res) => {
  // hash the password
  const { name, email, password, avatar } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = User.findOne({ email });
    if (existingUser) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }

    // Create a new user
    const user = User.create({ name, email, password, avatar });
    res.status(201).send({ status: "success", data: user });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    if (err.code === 11000) {
      // MongoDB duplicate error
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    return res
      .status(DEFAULT)
      .send({ message: "An error has occurred on the server" });
  }
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // ... fill in how to handle
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send(token);
    })
    .catch((err) => {
      // authentication error
      res.status(401).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login };
