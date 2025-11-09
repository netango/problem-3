import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAnalytics,
  getDashboardStats,
  getDoctorStats,
  updateDoctorStatus,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Dashboard and analytics
router.get('/dashboard-stats', authenticate, authorizeRoles('HOSPITAL_ADMIN'), getDashboardStats);
router.get('/analytics', authenticate, authorizeRoles('HOSPITAL_ADMIN'), getAnalytics);

// Doctor management with stats
router.get('/doctors', authenticate, authorizeRoles('HOSPITAL_ADMIN'), getDoctorStats);
router.get('/doctors/:id', authenticate, authorizeRoles('HOSPITAL_ADMIN'), getDoctorById);
router.post('/doctors', authenticate, authorizeRoles('HOSPITAL_ADMIN'), createDoctor);
router.put('/doctors/:id', authenticate, authorizeRoles('HOSPITAL_ADMIN'), updateDoctor);
router.put('/doctors/:id/status', authenticate, authorizeRoles('HOSPITAL_ADMIN'), updateDoctorStatus);
router.delete('/doctors/:id', authenticate, authorizeRoles('HOSPITAL_ADMIN'), deleteDoctor);

export default router;
