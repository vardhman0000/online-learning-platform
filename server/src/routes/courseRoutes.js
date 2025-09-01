const express = require('express');
const router = express.Router();

// Using a single, consistent import for controllers
const courseController = require('../controllers/courseController');
const lectureController = require('../controllers/lectureController');

// Assuming 'auth.js' exports 'protect' and 'authorize'.
// If your file is named authMiddleware.js, you might need to adjust the path.
const { protect, authorize } = require('../middleware/auth');

// --- Public and Student Routes ---

// GET /api/courses -> Get all available courses for browsing.
// This is a public route, so no 'protect' middleware is needed.
router.get('/', courseController.getAllCourses);

// GET /api/courses/mine -> Get all courses for the logged-in instructor.
// This MUST be defined before the '/:id' route to avoid conflicts.
router.get('/mine', protect, authorize('Instructor'), courseController.getCoursesByInstructor);

// GET /api/courses/:id -> Get details for a single course (student view).
// This requires the student to be logged in.
router.get('/:id', protect, courseController.getCourseDetails);


// --- Instructor Routes ---

router
  .route('/')
  // POST /api/courses -> Create a new course
  .post(protect, authorize('Instructor'), courseController.createCourse);

// Routes for managing a specific course by an instructor.
// I've used '/:id/manage' to avoid conflict with the student view 'GET /:id'
router
  .route('/:id')
  .get(protect, authorize('Instructor'), courseController.getCourse) // Instructor's view of a course
  .put(protect, authorize('Instructor'), courseController.updateCourse)
  .delete(protect, authorize('Instructor'), courseController.deleteCourse);

// POST /api/courses/:id/lectures -> Add a lecture to a course
router.post('/:courseId/lectures', protect, authorize('Instructor'), lectureController.addLectureToCourse);

module.exports = router;
