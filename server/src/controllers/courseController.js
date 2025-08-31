// const Course = require("../models/Course");
// const UserProgress = require('../models/UserProgress');
// const mongoose = require('mongoose');
// const Lecture = require("../models/Lecture");
// // const asyncHandler = require('../middleware/async');

// exports.createCourse = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const instructor = req.user.id; // Assuming user ID is available in req.user from auth middleware

//     // Check for duplicate course by the same instructor
//     const existingCourse = await Course.findOne({ title, instructor });
//     if (existingCourse) {
//       return res
//         .status(409)
//         .json({ message: "You have already created a course with this title." });
//     }

//     const course = new Course({
//       title,
//       description,
//       instructor,
//     });

//     await course.save();
//     res.status(201).json({ message: "Course created successfully", course });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Failed to create course", error: error.message });
//   }
// };

// // @desc    Get courses for the logged-in instructor
// // @route   GET /api/courses
// // @access  Private (Instructor)
// exports.getCoursesByInstructor = asyncHandler(async (req, res, next) => {
//   const courses = await Course.find({ instructor: req.user.id });
//   res.status(200).json({
//     success: true,
//     count: courses.length,
//     data: courses,
//   });
// });

// // @desc    Get single course
// // @route   GET /api/courses/:id
// // @access  Private
// exports.getCourse = asyncHandler(async (req, res, next) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(404).json({ success: false, message: 'Course not found' });
//   }
//   const course = await Course.findById(req.params.id).populate('lectures');
//   if (!course) {
//     return res.status(404).json({ success: false, message: 'Course not found' });
//   }
//   res.status(200).json({ success: true, data: course });
// });



// exports.getAllCourses = async (req, res) => {
//   try {
//     // Select only the title and description for the list view
//     const courses = await Course.find({}).select('title description');
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve courses', error: error.message });
//   }
// };

// exports.enrollInCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.user.id;

//     // Check if user is already enrolled
//     const existingProgress = await UserProgress.findOne({ user: userId, course: courseId });
//     if (existingProgress) {
//       return res.status(409).json({ message: 'Already enrolled in this course' });
//     }

//     // Create a new progress document
//     const progress = new UserProgress({ user: userId, course: courseId });
//     await progress.save();

//     res.status(201).json({ message: 'Successfully enrolled in course', progress });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to enroll in course', error: error.message });
//   }
// };

// exports.getCourseProgress = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.user.id;

//     const course = await Course.findById(courseId).lean();
//     if (!course) return res.status(404).json({ message: 'Course not found' });

//     const progress = await UserProgress.findOne({ user: userId, course: courseId }).lean();
//     const completedCount = progress ? progress.completedLectures.length : 0;

//     res.json({ completed: completedCount, total: course.lectures.length });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to get course progress', error: error.message });
//   }
// };


const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const asyncHandler = require('../middleware/async'); // Assuming you have this for error handling
const mongoose = require('mongoose');

// @desc    Get courses for the logged-in instructor
// @route   GET /api/courses
// @access  Private (Instructor)
exports.getCoursesByInstructor = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user.id });
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  const course = await Course.findById(req.params.id).populate('lectures');

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor)
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.instructor = req.user.id;
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    data: course,
  });
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor)
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // Make sure user is course owner
  if (course.instructor.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to update this course' });
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor)
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // Make sure user is course owner
  if (course.instructor.toString() !== req.user.id) {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this course' });
  }

  // Cascade delete lectures associated with the course
  await Lecture.deleteMany({ course: course._id });

  await course.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

