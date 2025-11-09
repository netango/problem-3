import express from 'express';
import {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorReferrals,
} from '../controllers/doctor.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, authorizeRoles('DOCTOR'), getDoctorProfile);
router.put('/profile', authenticate, authorizeRoles('DOCTOR'), updateDoctorProfile);
router.get('/referrals', authenticate, authorizeRoles('DOCTOR'), getDoctorReferrals);

export default router;
