const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
    required: true,
    validate: [(val) => val.length > 1, 'A question must have at least two answers.'],
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
});

// We export the schema to be used as a sub-document in the Lecture model.
module.exports = QuestionSchema;
