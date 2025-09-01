const mongoose = require("mongoose");
const QuestionSchema = require('./Question');

const lectureSchema = new mongoose.Schema({
  title: { 
    type: String, 
    trim : true,
    required: true 
  },
  type: { 
    type: String, 
    enum: ["reading", "quiz"],
    required: true 
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  // Content for Reading type lectures
  content: {
    type: String,
    required: function () {
      return this.type === 'reading';
    },
  },
  // Content for Quiz type lectures
  questions: {
    type: [QuestionSchema],
    required: function () {
      return this.type === 'quiz';
    },
  },
});

module.exports = mongoose.model("Lecture", lectureSchema);
