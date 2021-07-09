const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
    max: 300,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 300,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 1100,
  },
  date: {
    type: Date,
    default: Date.now  
  }
});

module.exports = mongoose.model('User', userSchema);
