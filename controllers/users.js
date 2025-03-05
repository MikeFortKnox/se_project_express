const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/constants");
const ConflictError = require("../errors/conflict");
const BadRequestError = require("../errors/badrequest");
const NotFoundError = require("../errors/notfound");
const UnauthorizedError = require("../errors/unauthorized");
// GET /users

const createUser = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // return res.status(CONFLICT).send({ message: "Email already exists" });
      return next(new ConflictError("Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = user.toObject(); // Use toObject() to convert Mongoose document to plain object
    return res.status(201).send({ data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      // return res.status(BAD_REQUEST).send({ message: err.message });
      return next(new BadRequestError("Invalid data"));
    }
    // return res
    //   .status(DEFAULT)
    //   .send({ message: "An error has occurred on the server" });
    return next(err);
  }
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // ... fill in how to handle
        // return res.status(NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        // return res.status(BAD_REQUEST).send({ message: err.message });
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occurred on the server" });
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res.status(BAD_REQUEST).send({ message: "error" });
    return next(new BadRequestError("Bad request error"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({
        token,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or Password") {
        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Incorrect username or Password " });
        return next(new UnauthorizedError("Incorrect username or password"));
      }
      // return res.status(DEFAULT).send({ message: "error" });
      return next(err);
    });
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    // Prepare the update object
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    // Update the user in the database
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).orFail();

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(200).send({ data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      // return res.status(NOT_FOUND).send({ message: "User not found." });
      return next(new NotFoundError("User not found"));
    }
    if (err.name === "ValidationError") {
      // return res.status(BAD_REQUEST).send({ message: err.message });
      return next(new BadRequestError("User not found"));
    }
    // return res
    //   .status(DEFAULT)
    //   .send({ message: "An error has occurred on the server." });
    return next(err);
  }
};

module.exports = { createUser, getCurrentUser, login, updateUser };
