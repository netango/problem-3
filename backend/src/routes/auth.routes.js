import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { registerValidation, loginValidation, validate } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', authenticate, getProfile);

export default router;
