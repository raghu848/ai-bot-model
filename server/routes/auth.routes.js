const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validate, registerValidators, loginValidators } = require('../middleware/validate');

router.post('/register', validate(registerValidators), register);
router.post('/login', validate(loginValidators), login);

module.exports = router;
