import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';
import { hashPassword } from '../utils/password.js';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      // Patient specific fields
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      insuranceProvider,
      insurancePolicyNumber,
      // Doctor specific fields
      specialization,
      licenseNumber,
      hospitalName,
      department,
    } = req.body;

    // Validate required fields
    if (!email || !password || !role || !firstName || !lastName) {
      return res.status(400).json({
        message: 'Email, password, role, first name, and last name are required'
      });
    }

    // Validate role
    const validRoles = ['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Must be PATIENT, DOCTOR, or HOSPITAL_ADMIN'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with role-specific data
    let user;

    if (role === 'PATIENT') {
      // Validate patient-specific fields
      if (!dateOfBirth || !address || !city || !state || !zipCode) {
        return res.status(400).json({
          message: 'Patient registration requires: dateOfBirth, address, city, state, zipCode'
        });
      }

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          phone,
          patient: {
            create: {
              dateOfBirth: new Date(dateOfBirth),
              address,
              city,
              state,
              zipCode,
              insuranceProvider,
              insurancePolicyNumber,
            },
          },
        },
        include: {
          patient: true,
        },
      });
    } else if (role === 'DOCTOR') {
      // Validate doctor-specific fields
      if (!specialization || !licenseNumber || !hospitalName || !department) {
        return res.status(400).json({
          message: 'Doctor registration requires: specialization, licenseNumber, hospitalName, department'
        });
      }

      // Check if license number already exists
      const existingDoctor = await prisma.doctor.findUnique({
        where: { licenseNumber },
      });

      if (existingDoctor) {
        return res.status(400).json({ message: 'Doctor with this license number already exists' });
      }

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          phone,
          doctor: {
            create: {
              specialization,
              licenseNumber,
              hospitalName,
              department,
            },
          },
        },
        include: {
          doctor: true,
        },
      });
    } else if (role === 'HOSPITAL_ADMIN') {
      // Validate admin-specific fields
      if (!hospitalName) {
        return res.status(400).json({
          message: 'Hospital Admin registration requires: hospitalName'
        });
      }

      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          firstName,
          lastName,
          phone,
          hospitalAdmin: {
            create: {
              hospitalName,
              department,
            },
          },
        },
        include: {
          hospitalAdmin: true,
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: true,
        doctor: true,
        hospitalAdmin: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // User is already attached to req by authenticate middleware
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
        doctor: true,
        hospitalAdmin: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        patient: true,
        doctor: true,
        hospitalAdmin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error getting profile', error: error.message });
  }
};
