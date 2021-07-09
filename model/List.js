const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    min: 5,
    max: 300,
  },
  itemTitle: {
    type: String,
    required: true,
    min: 1,
    max: 300,
  },
  itemDescription: {
    type: String,
    required: true,
    min: 1,
    max: 600,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("List", listSchema);
