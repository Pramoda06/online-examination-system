const express = require('express');
const { getMe, loginUser, registerUser } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
