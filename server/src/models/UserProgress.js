const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: Number // index of the answer
  }],
  submittedAt: { type: Date, default: Date.now }
});

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
  quizAttempts: [quizAttemptSchema]
}, { timestamps: true });

// To ensure a user can only have one progress document per course
userProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);