const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "Must be at least 2 characters"],
    maxlength: [30, "Must be no more than 30 characters"],
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },
  owner: {
    type: String,
    required: true,
  },
  likes: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    date: new Date(),
  },
});

module.exports = mongoose.model("clothingItemSchema", clothingItemSchema);
