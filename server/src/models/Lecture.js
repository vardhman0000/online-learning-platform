const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["Reading", "Quiz"], required: true },
  content: { type: mongoose.Schema.Types.Mixed }, // Store reading text/link or quiz questions
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

module.exports = mongoose.model("Lecture", lectureSchema);
