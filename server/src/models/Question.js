const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: Number, required: true }, // Index of the correct answer in the answers array
});

module.exports = mongoose.model("Question", questionSchema);
