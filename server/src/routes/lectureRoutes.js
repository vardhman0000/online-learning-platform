const express = require('express');
const router = express.Router();
const lectureController = require('../controllers/lectureController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/', verifyToken, authorizeRole(['Instructor']), lectureController.addLecture);

module.exports = router;
