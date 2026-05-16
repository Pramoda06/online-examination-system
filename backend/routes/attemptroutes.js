const express = require('express');
const { getAttemptById, getLeaderboard, getMyAttempts, submitAttempt } = require('../controllers/attemptcontroller');
const { protect } = require('../middleware/authmiddleware');
const { authorizeRoles } = require('../middleware/rolemiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('student'));

router.get('/mine', getMyAttempts);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getAttemptById);
router.post('/:quizId/submit', submitAttempt);

module.exports = router;
