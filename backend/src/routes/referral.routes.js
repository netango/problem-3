import express from 'express';
import {
  createReferral,
  getReferralById,
  updateReferralStatus,
  getMatchingSpecialists,
  selectSpecialist,
  getPatientReferrals,
  getDoctorReferrals,
} from '../controllers/referral.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create referral (Doctor only)
router.post('/', authenticate, authorizeRoles('DOCTOR'), createReferral);

// Get referrals by role
router.get('/patient', authenticate, authorizeRoles('PATIENT'), getPatientReferrals);
router.get('/doctor', authenticate, authorizeRoles('DOCTOR'), getDoctorReferrals);

// Referral operations
router.get('/:id', authenticate, getReferralById);
router.put('/:id/status', authenticate, updateReferralStatus);
router.get('/:id/matching-specialists', authenticate, getMatchingSpecialists);
router.post('/:id/select-specialist', authenticate, authorizeRoles('PATIENT'), selectSpecialist);

export default router;
