import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Demo mode: Create mock users for each role
const createDemoUser = (role = 'PATIENT') => {
  const demoUsers = {
    PATIENT: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'demo.patient@healthconnect.com',
      role: 'PATIENT',
      firstName: 'John',
      lastName: 'Doe',
    },
    DOCTOR: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'demo.doctor@healthconnect.com',
      role: 'DOCTOR',
      firstName: 'Sarah',
      lastName: 'Williams',
    },
    HOSPITAL_ADMIN: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 'demo.admin@healthconnect.com',
      role: 'HOSPITAL_ADMIN',
      firstName: 'Michael',
      lastName: 'Chen',
    },
  };

  return demoUsers[role] || demoUsers.PATIENT;
};

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const fullPath = req.originalUrl || req.url || req.path;

    // Demo mode: If no token, assign a demo user based on the endpoint
    if (!token) {
      // Determine role based on endpoint
      let demoRole = 'PATIENT';
      if (fullPath.includes('/doctor') || fullPath.includes('/referrals/doctor')) {
        demoRole = 'DOCTOR';
      } else if (fullPath.includes('/admin')) {
        demoRole = 'HOSPITAL_ADMIN';
      }

      req.user = createDemoUser(demoRole);
      return next();
    }

    // Try to verify token, but fallback to demo mode if it fails
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
        },
      });

      if (user) {
        req.user = user;
        return next();
      }
    } catch (jwtError) {
      // Token verification failed, use demo mode
      console.log('Token verification failed, using demo mode');
    }

    // Fallback to demo user
    let demoRole = 'PATIENT';
    if (fullPath.includes('/doctor') || fullPath.includes('/referrals/doctor')) {
      demoRole = 'DOCTOR';
    } else if (fullPath.includes('/admin')) {
      demoRole = 'HOSPITAL_ADMIN';
    }

    req.user = createDemoUser(demoRole);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    // Even on error, use demo mode
    req.user = createDemoUser('PATIENT');
    next();
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const fullPath = req.originalUrl || req.url || req.path;

    if (!req.user) {
      // Assign demo user if somehow missing
      req.user = createDemoUser('PATIENT');
    }

    if (!roles.includes(req.user.role)) {
      // In demo mode, try to guess the right role based on endpoint
      let guessedRole = 'PATIENT';
      if (fullPath.includes('/doctor')) {
        guessedRole = 'DOCTOR';
      } else if (fullPath.includes('/admin')) {
        guessedRole = 'HOSPITAL_ADMIN';
      }

      // If guessed role is in allowed roles, use it
      if (roles.includes(guessedRole)) {
        req.user = createDemoUser(guessedRole);
        return next();
      }

      return res.status(403).json({
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};
