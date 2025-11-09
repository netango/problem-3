import express from 'express';
import {
  getPatientProfile,
  updatePatientProfile,
  getPatientReferrals,
  getPatientAppointments,
  getDoctorPatients,
} from '../controllers/patient.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Patient routes
router.get('/profile', authenticate, authorizeRoles('PATIENT'), getPatientProfile);
router.put('/profile', authenticate, authorizeRoles('PATIENT'), updatePatientProfile);
router.get('/referrals', authenticate, authorizeRoles('PATIENT'), getPatientReferrals);
router.get('/appointments', authenticate, authorizeRoles('PATIENT'), getPatientAppointments);

// Doctor routes (to access their patients)
router.get('/doctor-patients', authenticate, authorizeRoles('DOCTOR'), getDoctorPatients);

export default router;
