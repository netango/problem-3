import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPatientProfile = async (req, res) => {
  try {
    // TODO: Implement get patient profile logic
    res.status(501).json({ message: 'Get patient profile endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting patient profile', error: error.message });
  }
};

export const updatePatientProfile = async (req, res) => {
  try {
    // TODO: Implement update patient profile logic
    res.status(501).json({ message: 'Update patient profile endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient profile', error: error.message });
  }
};

export const getPatientReferrals = async (req, res) => {
  try {
    // TODO: Implement get patient referrals logic
    res.status(501).json({ message: 'Get patient referrals endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting patient referrals', error: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    // TODO: Implement get patient appointments logic
    res.status(501).json({ message: 'Get patient appointments endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error getting patient appointments', error: error.message });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }

    // Get all unique patients from doctor's referrals
    const referrals = await prisma.referral.findMany({
      where: {
        doctorId: doctor.id,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get unique patients
    const uniquePatients = [];
    const seenPatientIds = new Set();

    for (const referral of referrals) {
      if (!seenPatientIds.has(referral.patient.id)) {
        seenPatientIds.add(referral.patient.id);
        uniquePatients.push({
          id: referral.patient.id,
          userId: referral.patient.userId,
          firstName: referral.patient.user.firstName,
          lastName: referral.patient.user.lastName,
          email: referral.patient.user.email,
          phone: referral.patient.user.phone,
          dateOfBirth: referral.patient.dateOfBirth,
          address: referral.patient.address,
          city: referral.patient.city,
          state: referral.patient.state,
          zipCode: referral.patient.zipCode,
          insuranceProvider: referral.patient.insuranceProvider,
          insurancePolicyNumber: referral.patient.insurancePolicyNumber,
          lastReferralDate: referral.createdAt,
        });
      }
    }

    res.status(200).json({ patients: uniquePatients });
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({ message: 'Error getting doctor patients', error: error.message });
  }
};
