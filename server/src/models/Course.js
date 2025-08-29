const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the instructor
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }], // Array of lecture references
});

module.exports = mongoose.model("Course", courseSchema);
