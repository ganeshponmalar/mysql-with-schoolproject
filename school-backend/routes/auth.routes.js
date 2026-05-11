const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const joi = require('joi');

const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(6),
    role: joi.string().valid('admin', 'teacher', 'student').required()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    role: joi.string().valid('admin', 'teacher', 'student').optional()
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;
