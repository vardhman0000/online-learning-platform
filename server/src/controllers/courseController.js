const Course = require("../models/Course");
const UserProgress = require('../models/UserProgress');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const instructor = req.user.id; // Assuming user ID is available in req.user from auth middleware

    // Check for duplicate course by the same instructor
    const existingCourse = await Course.findOne({ title, instructor });
    if (existingCourse) {
      return res
        .status(409)
        .json({ message: "You have already created a course with this title." });
    }

    const course = new Course({
      title,
      description,
      instructor,
    });

    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create course", error: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    // Select only the title and description for the list view
    const courses = await Course.find({}).select('title description');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve courses', error: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if user is already enrolled
    const existingProgress = await UserProgress.findOne({ user: userId, course: courseId });
    if (existingProgress) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    // Create a new progress document
    const progress = new UserProgress({ user: userId, course: courseId });
    await progress.save();

    res.status(201).json({ message: 'Successfully enrolled in course', progress });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enroll in course', error: error.message });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const progress = await UserProgress.findOne({ user: userId, course: courseId }).lean();
    const completedCount = progress ? progress.completedLectures.length : 0;

    res.json({ completed: completedCount, total: course.lectures.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get course progress', error: error.message });
  }
};