import express from 'express';
import {
  getAvailableSlots,
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getAppointmentById,
} from '../controllers/appointment.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get available slots for a specialist on a specific date
router.get('/available-slots/:specialistId', getAvailableSlots);

// Create appointment
router.post('/', authenticate, authorizeRoles('PATIENT'), createAppointment);

// Get appointments by role
router.get('/patient', authenticate, authorizeRoles('PATIENT'), getPatientAppointments);
router.get('/doctor', authenticate, authorizeRoles('DOCTOR'), getDoctorAppointments);

// Get appointment by ID
router.get('/:id', authenticate, getAppointmentById);

// Cancel appointment
router.put('/:id/cancel', authenticate, cancelAppointment);

export default router;
