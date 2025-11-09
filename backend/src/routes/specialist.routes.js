import express from 'express';
import {
  getAllSpecialists,
  getSpecialistById,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist,
} from '../controllers/specialist.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllSpecialists);
router.get('/:id', authenticate, getSpecialistById);
router.post('/', authenticate, authorizeRoles('HOSPITAL_ADMIN'), createSpecialist);
router.put('/:id', authenticate, authorizeRoles('HOSPITAL_ADMIN'), updateSpecialist);
router.delete('/:id', authenticate, authorizeRoles('HOSPITAL_ADMIN'), deleteSpecialist);

export default router;
