const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const lectureController = require('../controllers/lectureController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// --- Course-level routes ---

// POST /api/courses (Instructor: Create a course)
router.post('/', verifyToken, authorizeRole(['Instructor']), courseController.createCourse);

// GET /api/courses (Student/Instructor: View all available courses)
router.get('/', verifyToken, authorizeRole(['Student', 'Instructor']), courseController.getAllCourses);

// POST /api/courses/:courseId/enroll (Student: Enroll in a course)
router.post('/:courseId/enroll', verifyToken, authorizeRole(['Student']), courseController.enrollInCourse);

// GET /api/courses/:courseId/progress (Student: Get progress for a course)
router.get('/:courseId/progress', verifyToken, authorizeRole(['Student']), courseController.getCourseProgress);

// --- Nested Lecture routes ---
router.post('/:courseId/lectures', verifyToken, authorizeRole(['Instructor']), lectureController.addLecture);
router.get('/:courseId/lectures/:lectureId', verifyToken, authorizeRole(['Student']), lectureController.getLecture);
router.post('/:courseId/lectures/:lectureId/submit', verifyToken, authorizeRole(['Student']), lectureController.submitQuiz);

module.exports = router;
