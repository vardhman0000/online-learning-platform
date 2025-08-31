// const Lecture = require("../models/Lecture");
// const Course = require("../models/Course");
// const Question = require("../models/Question");
// const UserProgress = require('../models/UserProgress');

// exports.addLecture = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { title, type, content } = req.body;

//     // Check if the course exists and the instructor owns it (authorization)
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }
//     if (course.instructor.toString() !== req.user.id) {
//       // Ensure instructor owns the course
//       return res
//         .status(403)
//         .json({ message: "Unauthorized: You do not own this course" });
//     }

//     // Check for duplicate lecture in the same course
//     const existingLecture = await Lecture.findOne({ title, course: courseId });
//     if (existingLecture) {
//       return res
//         .status(409)
//         .json({
//           message: "A lecture with this title already exists in this course.",
//         });
//     }

//     let lectureContent = content;

//     if (type === "Quiz") {
//       // Create Question documents for each question
//       lectureContent = [];
//       for (const questionData of content) {
//         const question = new Question(questionData);
//         await question.save();
//         lectureContent.push(question._id); // Store question IDs in the lecture content
//       }
//     }

//     const lecture = new Lecture({
//       title,
//       type,
//       content: lectureContent, // Store either text/link or array of question IDs
//       course: courseId,
//     });

//     await lecture.save();

//     // Update the course with the new lecture
//     course.lectures.push(lecture._id);
//     await course.save();

//     res.status(201).json({ message: "Lecture added successfully", lecture });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Failed to add lecture", error: error.message });
//   }
// };

// exports.getLecture = async (req, res) => {
//   try {
//     const { courseId, lectureId } = req.params;
//     const userId = req.user.id;

//     const progress = await UserProgress.findOne({ user: userId, course: courseId });
//     if (!progress) {
//       return res.status(403).json({ message: 'You are not enrolled in this course.' });
//     }

//     // 1. Fetch the lecture first without populating content
//     let lecture = await Lecture.findById(lectureId).lean();

//     if (!lecture) {
//       return res.status(404).json({ message: 'Lecture not found' });
//     }

//     // 2. Conditionally populate the content only if it's a quiz
//     if (lecture.type === 'Quiz') {
//       lecture = await Lecture.populate(lecture, {
//         path: 'content',
//         model: 'Question',
//         select: '-correctAnswer' // Hide correct answer from student
//       });
//     }

//     // If it's a 'Reading' lecture, mark it as complete upon viewing
//     if (lecture.type === 'Reading') {
//       await UserProgress.updateOne(
//         { _id: progress._id },
//         { $addToSet: { completedLectures: lectureId } }
//       );
//     }

//     res.json(lecture);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve lecture', error: error.message });
//   }
// };

// exports.submitQuiz = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const userId = req.user.id;
//     const { answers } = req.body; // Expects: [{ questionId, selectedAnswer }]
    
//     // Add validation to ensure 'answers' exists and is an array.
//     if (!answers || !Array.isArray(answers)) {
//       return res.status(400).json({
//         message: 'Failed to submit quiz: "answers" property is missing or not an array in the request body.',
//       });
//     }

//     const lecture = await Lecture.findById(lectureId).populate({
//       path: 'content',
//       model: 'Question'
//     });
//     if (!lecture || lecture.type !== 'Quiz') {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }

//     const progress = await UserProgress.findOne({ user: userId, course: lecture.course });
//     if (!progress) {
//       return res.status(403).json({ message: 'You are not enrolled in this course.' });
//     }

//     // Grade the quiz
//     const questions = lecture.content;

//     if (!questions || !Array.isArray(questions)) {
//       console.error(`Quiz lecture ${lectureId} has no questions or malformed content.`);
//       return res.status(500).json({ message: 'Internal Server Error: Quiz content is missing or malformed.' });
//     }

//     let correctCount = 0;
//     answers.forEach(studentAnswer => {
//       const question = questions.find(q => q._id.toString() === studentAnswer.questionId);
//       if (question && question.correctAnswer === studentAnswer.selectedAnswer) {
//         correctCount++;
//       }
//     });

//     const score = (correctCount / questions.length) * 100;
//     const passed = score >= 70; // 70% passing grade

//     if (passed) {
//       progress.completedLectures.addToSet(lectureId);
//     }

//     progress.quizAttempts.push({ lecture: lectureId, score, passed, answers });
//     await progress.save();

//     res.json({ message: 'Quiz submitted successfully', score, passed, correctCount, totalQuestions: questions.length });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to submit quiz', error: error.message });
//   }
// };



// server/src/controllers/lectureController.js
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');

// @desc    Add a lecture to a course
// @route   POST /api/courses/:courseId/lectures
// @access  Private (Instructor)
exports.addLectureToCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  if (course.instructor.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to add a lecture' });
  }

  const lecture = await Lecture.create({ ...req.body, course: req.params.courseId });

  course.lectures.push(lecture._id);
  await course.save();

  res.status(201).json({ success: true, data: lecture });
});

// @desc    Update a lecture
// @route   PUT /api/lectures/:id
// @access  Private (Instructor)
exports.updateLecture = asyncHandler(async (req, res, next) => {
  let lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ success: false, message: 'Lecture not found' });
  }

  const course = await Course.findById(lecture.course);
  if (course.instructor.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to update this lecture' });
  }

  lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: lecture });
});

// @desc    Delete a lecture
// @route   DELETE /api/lectures/:id
// @access  Private (Instructor)
exports.deleteLecture = asyncHandler(async (req, res, next) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    return res.status(404).json({ success: false, message: 'Lecture not found' });
  }

  const course = await Course.findById(lecture.course);
  if (course.instructor.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this lecture' });
  }

  await lecture.deleteOne();
  course.lectures.pull(lecture._id);
  await course.save();

  res.status(200).json({ success: true, data: {} });
});
