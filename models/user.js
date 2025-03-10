const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "Must be a valid email address",
    },
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  console.log({ email });
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log({ user });
      if (!user) {
        const error = new Error("Incorrect email or Password");
        return Promise.reject(error);
      }
      return bcrypt.compare(password, user.password).then((isCorrect) => {
        if (isCorrect) {
          return user;
        }
        throw new Error("Incorrect email or Password");
      });
    });
};

module.exports = mongoose.model("user", userSchema);
