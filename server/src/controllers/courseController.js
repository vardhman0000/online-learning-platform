const Course = require("../models/Course");
const Lecture = require("../models/Lecture");
const User = require('../models/User');
const asyncHandler = require('../middleware/async'); // Assuming you have this for error handling
const mongoose = require('mongoose');

// @desc    Get all available courses for students
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({}, 'title description');
  res.status(200).json({ success: true, data: courses });
});

// @desc    Get a single course with its lectures and user progress (Student View)
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseDetails = asyncHandler(async (req, res, next) => {
  // The route uses '/:id', so we must use req.params.id here.
  console.log("Fetching course details for course ID:", req.params.id);
  
  const course = await Course.findById(req.params.id).populate('lectures', 'title type content questions').lean();
  console.log("Course fetched:", course);
  

  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  // Find user progress for this specific course
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const courseProgress = user.progress.find(p => p.course.toString() === req.params.id);

  const completedLectures = courseProgress ? courseProgress.completedLectures.map(id => id.toString()) : [];

  // Augment lectures with completion status
  course.lectures = course.lectures.map(lecture => ({
    ...lecture,
    isCompleted: completedLectures.includes(lecture._id.toString())
  }));

  res.status(200).json({
    success: true,
    data: {
      course,
      completedLectures
    }
  });
});

// @desc    Get courses for the logged-in instructor
// @route   GET /api/courses/mine
// @access  Private (Instructor)
exports.getCoursesByInstructor = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user.id });
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get single course (Instructor View)
// @route   GET /api/courses/:id/manage
// @access  Private (Instructor)
exports.getCourse = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }
  const course = await Course.findById(req.params.id).populate('lectures');

  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  // Optional: Check if the instructor owns the course
  if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this course' });
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
// @route   PUT /api/courses/:id/manage
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
// @route   DELETE /api/courses/:id/manage
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
