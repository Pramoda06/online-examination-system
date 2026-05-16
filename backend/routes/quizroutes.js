const express = require('express');
const {
  createQuiz,
  getQuizDomains,
  getInstructorQuizzes,
  getPublishedQuizzes,
  getQuizAnalytics,
  getQuizForAttempt,
  updateQuiz,
} = require('../controllers/quizcontroller');
const { protect } = require('../middleware/authmiddleware');
const { authorizeRoles } = require('../middleware/rolemiddleware');

const router = express.Router();

router.get('/published', protect, authorizeRoles('student'), getPublishedQuizzes);
router.get('/domains', protect, authorizeRoles('student'), getQuizDomains);
router.get('/attempt/:id', protect, authorizeRoles('student'), getQuizForAttempt);
router.get('/:id/analytics', protect, authorizeRoles('instructor'), getQuizAnalytics);
router.route('/')
  .get(protect, authorizeRoles('instructor'), getInstructorQuizzes)
  .post(protect, authorizeRoles('instructor'), createQuiz);
router.put('/:id', protect, authorizeRoles('instructor'), updateQuiz);

module.exports = router;
