const express = require('express');
const {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} = require('../controllers/questioncontroller');
const { protect } = require('../middleware/authmiddleware');
const { authorizeRoles } = require('../middleware/rolemiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('instructor'));

router.route('/').get(getQuestions).post(createQuestion);
router.route('/:id').put(updateQuestion).delete(deleteQuestion);

module.exports = router;
