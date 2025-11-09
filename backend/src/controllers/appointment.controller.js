import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate time slots
const generateTimeSlots = (availableHours) => {
  const slots = [];
  // Default to 9 AM - 5 PM if not specified
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }

  return slots;
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { specialistId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Get specialist
    const specialist = await prisma.specialist.findUnique({
      where: { id: specialistId },
    });

    if (!specialist) {
      return res.status(404).json({ message: 'Specialist not found' });
    }

    // Check if the date is an available day
    // Parse date as local date (not UTC) to get correct day of week
    const [year, month, day] = date.split('-').map(Number);
    const requestedDate = new Date(year, month - 1, day);
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const availableDays = JSON.parse(specialist.availableDays);

    if (!availableDays.includes(dayName)) {
      return res.status(200).json({ availableSlots: [], message: 'Specialist not available on this day' });
    }

    // Generate all possible time slots
    const allSlots = generateTimeSlots(specialist.availableHours);

    // Get already booked appointments for this specialist on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        specialistId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        appointmentTime: true,
      },
    });

    // Filter out booked slots
    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.status(200).json({ availableSlots, date, dayName });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({ message: 'Error getting available slots', error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { referralId, specialistId, appointmentDate, appointmentTime, notes } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!referralId || !specialistId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: 'Referral ID, specialist ID, appointment date, and time are required',
      });
    }

    // Get patient record
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    // Get referral and verify it belongs to this patient
    const referral = await prisma.referral.findUnique({
      where: { id: referralId },
      include: {
        patient: true,
        specialist: true,
      },
    });

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    if (referral.patientId !== patient.id) {
      return res.status(403).json({ message: 'Not authorized to book appointment for this referral' });
    }

    if (referral.status !== 'PENDING_APPOINTMENT') {
      return res.status(400).json({
        message: `Cannot book appointment. Referral status is ${referral.status}. Please select a specialist first.`,
      });
    }

    // Check if specialist matches the referral
    if (referral.specialistId !== specialistId) {
      return res.status(400).json({ message: 'Specialist does not match the referral' });
    }

    // Check if the time slot is still available
    const appointmentDateTime = new Date(appointmentDate);
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        specialistId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        appointmentTime,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: 'This time slot is no longer available. Please select another time.',
      });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        referralId,
        patientId: patient.id,
        specialistId,
        appointmentDate: appointmentDateTime,
        appointmentTime,
        status: 'SCHEDULED',
        notes,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        specialist: true,
        referral: true,
      },
    });

    // Update referral status to SCHEDULED
    await prisma.referral.update({
      where: { id: referralId },
      data: { status: 'SCHEDULED' },
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get patient record
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    // Get all appointments for this patient
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        specialist: true,
        referral: {
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ message: 'Error getting patient appointments', error: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }

    // Get all appointments for referrals created by this doctor
    const appointments = await prisma.appointment.findMany({
      where: {
        referral: {
          doctorId: doctor.id,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        specialist: true,
        referral: true,
      },
      orderBy: {
        appointmentDate: 'asc',
      },
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Error getting doctor appointments', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        referral: {
          include: {
            doctor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    const isPatient = userRole === 'PATIENT' && appointment.patient.userId === userId;
    const isDoctor = userRole === 'DOCTOR' && appointment.referral.doctor.userId === userId;

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    if (appointment.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    // Cancel the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason ? `${appointment.notes || ''}\nCancellation reason: ${reason}` : appointment.notes,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        specialist: true,
        referral: true,
      },
    });

    // Update referral status back to PENDING_APPOINTMENT
    await prisma.referral.update({
      where: { id: appointment.referralId },
      data: { status: 'PENDING_APPOINTMENT' },
    });

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        specialist: true,
        referral: {
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Error getting appointment', error: error.message });
  }
};
