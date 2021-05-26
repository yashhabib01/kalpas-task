const mongoose = require("mongoose");

const bookModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  genre: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Book", bookModel);
