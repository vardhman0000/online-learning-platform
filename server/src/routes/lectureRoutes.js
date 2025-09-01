// const express = require('express');
// const router = express.Router();
// const lectureController = require('../controllers/lectureController');
// const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// router.post('/', verifyToken, authorizeRole(['Instructor']), lectureController.addLecture);

// module.exports = router;



// server/src/routes/lectureRoutes.js (New File)
const express = require('express');
const {
  updateLecture,
  deleteLecture,
} = require('../controllers/lectureController');
const lectureController = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:lectureId', protect, lectureController.getLecture);
router.post('/:lectureId/complete', protect, lectureController.markAsComplete);
router.post('/:lectureId/quiz/submit', protect, lectureController.submitQuiz);

// Routes for modifying a specific lecture
router
  .route('/:id')
  .put(protect, authorize('Instructor'), updateLecture)
  .delete(protect, authorize('Instructor'), deleteLecture);

module.exports = router;
