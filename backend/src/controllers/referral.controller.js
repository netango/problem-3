import { PrismaClient } from '@prisma/client';
import { calculateMatchScore } from '../utils/distance.js';

const prisma = new PrismaClient();

export const createReferral = async (req, res) => {
  try {
    const { patientId, specialization, chiefComplaint, clinicalNotes, urgency } = req.body;
    const doctorId = req.user.id; // From authenticate middleware

    // Validate required fields
    if (!patientId || !specialization || !chiefComplaint || !urgency) {
      return res.status(400).json({
        message: 'Patient ID, specialization, chief complaint, and urgency are required'
      });
    }

    // Get patient details including location and insurance
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get doctor details
    const doctor = await prisma.doctor.findUnique({
      where: { userId: doctorId },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Find all specialists matching the specialization
    const specialists = await prisma.specialist.findMany({
      where: {
        specialization: specialization,
      },
    });

    console.log('🔍 SMART MATCHING DEBUG:');
    console.log('Patient insurance:', patient.insuranceProvider);
    console.log('Requested specialty:', specialization);
    console.log('Total specialists found:', specialists.length);

    if (specialists.length === 0) {
      return res.status(404).json({
        message: `No specialists found for ${specialization}`
      });
    }

    // Filter specialists by insurance if patient has insurance
    let matchedSpecialists = specialists;
    if (patient.insuranceProvider) {
      matchedSpecialists = specialists.filter((specialist) => {
        const acceptedInsurance = JSON.parse(specialist.acceptedInsurance || '[]');

        // Case-insensitive and flexible insurance matching
        const matchesInsurance = acceptedInsurance.some(ins =>
          ins.toLowerCase().includes(patient.insuranceProvider.toLowerCase()) ||
          patient.insuranceProvider.toLowerCase().includes(ins.toLowerCase())
        );

        if (matchesInsurance) {
          console.log(`✓ ${specialist.firstName} ${specialist.lastName} accepts ${patient.insuranceProvider}`);
        }

        return matchesInsurance;
      });
    }

    console.log('After insurance filter:', matchedSpecialists.length);

    if (matchedSpecialists.length === 0) {
      return res.status(404).json({
        message: `No specialists found that accept ${patient.insuranceProvider} insurance`
      });
    }

    // Calculate match scores for each specialist using SMART MATCHING
    const specialistsWithScores = matchedSpecialists.map((specialist) => {
      const scores = calculateMatchScore(
        specialist,
        patient.latitude,
        patient.longitude
      );

      return {
        id: specialist.id,
        firstName: specialist.firstName,
        lastName: specialist.lastName,
        specialization: specialist.specialization,
        hospitalName: specialist.hospitalName,
        address: specialist.address,
        city: specialist.city,
        state: specialist.state,
        phone: specialist.phone,
        email: specialist.email,
        rating: specialist.rating,
        completionRate: specialist.completionRate,
        avgWaitDays: specialist.avgWaitDays,
        nextAvailableDate: specialist.nextAvailableDate,
        availableDays: JSON.parse(specialist.availableDays),
        availableHours: specialist.availableHours,
        acceptedInsurance: JSON.parse(specialist.acceptedInsurance),
        distance: scores.distance,
        matchScore: scores.totalScore,
        distanceScore: scores.distanceScore,
        availabilityScore: scores.availabilityScore,
        performanceScore: scores.performanceScore,
      };
    });

    // Sort by match score (highest first) and take top 5
    const topMatches = specialistsWithScores
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    console.log(`\n🎯 SMART MATCHING RESULTS: Found ${topMatches.length} top matches`);
    topMatches.forEach((match, index) => {
      console.log(`${index + 1}. Dr. ${match.firstName} ${match.lastName} - Score: ${Math.round(match.matchScore)}% (Distance: ${match.distance}mi)`);
    });
    console.log('');

    // Create referral with matched specialists
    const referral = await prisma.referral.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        specialization,
        chiefComplaint,
        clinicalNotes,
        urgency,
        status: 'PENDING_SELECTION',
        matchedSpecialists: JSON.stringify(topMatches.map(s => ({ id: s.id, matchScore: s.matchScore }))),
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
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
    });

    res.status(201).json({
      message: 'Referral created successfully with SMART MATCHING',
      referral,
      matchedSpecialists: topMatches,
    });
  } catch (error) {
    console.error('Create referral error:', error);
    res.status(500).json({ message: 'Error creating referral', error: error.message });
  }
};

export const getReferralById = async (req, res) => {
  try {
    const { id } = req.params;

    const referral = await prisma.referral.findUnique({
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
        specialist: true,
        appointment: true,
      },
    });

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    // Get full specialist details if matched specialists exist
    let matchedSpecialists = [];
    if (referral.matchedSpecialists) {
      const matchedIds = JSON.parse(referral.matchedSpecialists);
      const specialists = await prisma.specialist.findMany({
        where: {
          id: { in: matchedIds.map(m => m.id) },
        },
      });

      // Recalculate scores for display
      matchedSpecialists = specialists.map((specialist) => {
        const matchInfo = matchedIds.find(m => m.id === specialist.id);
        const scores = calculateMatchScore(
          specialist,
          referral.patient.latitude,
          referral.patient.longitude
        );

        return {
          id: specialist.id,
          firstName: specialist.firstName,
          lastName: specialist.lastName,
          specialization: specialist.specialization,
          hospitalName: specialist.hospitalName,
          address: specialist.address,
          city: specialist.city,
          state: specialist.state,
          phone: specialist.phone,
          email: specialist.email,
          rating: specialist.rating,
          completionRate: specialist.completionRate,
          avgWaitDays: specialist.avgWaitDays,
          nextAvailableDate: specialist.nextAvailableDate,
          availableDays: JSON.parse(specialist.availableDays),
          availableHours: specialist.availableHours,
          acceptedInsurance: JSON.parse(specialist.acceptedInsurance),
          distance: scores.distance,
          matchScore: matchInfo.matchScore,
          distanceScore: scores.distanceScore,
          availabilityScore: scores.availabilityScore,
          performanceScore: scores.performanceScore,
        };
      }).sort((a, b) => b.matchScore - a.matchScore);
    }

    res.status(200).json({
      referral,
      matchedSpecialists,
    });
  } catch (error) {
    console.error('Get referral error:', error);
    res.status(500).json({ message: 'Error getting referral', error: error.message });
  }
};

export const updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const referral = await prisma.referral.update({
      where: { id },
      data: { status },
      include: {
        patient: true,
        doctor: true,
        specialist: true,
      },
    });

    res.status(200).json({ message: 'Referral status updated', referral });
  } catch (error) {
    console.error('Update referral status error:', error);
    res.status(500).json({ message: 'Error updating referral status', error: error.message });
  }
};

export const getMatchingSpecialists = async (req, res) => {
  try {
    const { id } = req.params; // referral ID

    const referral = await prisma.referral.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    // Get matched specialists from referral
    if (!referral.matchedSpecialists) {
      return res.status(404).json({ message: 'No matched specialists found for this referral' });
    }

    const matchedIds = JSON.parse(referral.matchedSpecialists);
    const specialists = await prisma.specialist.findMany({
      where: {
        id: { in: matchedIds.map(m => m.id) },
      },
    });

    // Calculate scores
    const specialistsWithScores = specialists.map((specialist) => {
      const matchInfo = matchedIds.find(m => m.id === specialist.id);
      const scores = calculateMatchScore(
        specialist,
        referral.patient.latitude,
        referral.patient.longitude
      );

      return {
        id: specialist.id,
        firstName: specialist.firstName,
        lastName: specialist.lastName,
        specialization: specialist.specialization,
        hospitalName: specialist.hospitalName,
        address: specialist.address,
        city: specialist.city,
        state: specialist.state,
        phone: specialist.phone,
        email: specialist.email,
        rating: specialist.rating,
        completionRate: specialist.completionRate,
        avgWaitDays: specialist.avgWaitDays,
        nextAvailableDate: specialist.nextAvailableDate,
        availableDays: JSON.parse(specialist.availableDays),
        availableHours: specialist.availableHours,
        acceptedInsurance: JSON.parse(specialist.acceptedInsurance),
        distance: scores.distance,
        matchScore: matchInfo.matchScore,
        distanceScore: scores.distanceScore,
        availabilityScore: scores.availabilityScore,
        performanceScore: scores.performanceScore,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ matchedSpecialists: specialistsWithScores });
  } catch (error) {
    console.error('Get matching specialists error:', error);
    res.status(500).json({ message: 'Error finding matching specialists', error: error.message });
  }
};

export const selectSpecialist = async (req, res) => {
  try {
    const { id } = req.params; // referral ID
    const { specialistId } = req.body;

    if (!specialistId) {
      return res.status(400).json({ message: 'Specialist ID is required' });
    }

    // Update referral with selected specialist
    const referral = await prisma.referral.update({
      where: { id },
      data: {
        specialistId,
        status: 'PENDING_APPOINTMENT',
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        specialist: true,
      },
    });

    res.status(200).json({
      message: 'Specialist selected successfully',
      referral,
    });
  } catch (error) {
    console.error('Select specialist error:', error);
    res.status(500).json({ message: 'Error selecting specialist', error: error.message });
  }
};

export const getPatientReferrals = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get patient record
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient record not found' });
    }

    // Get all referrals for this patient
    const referrals = await prisma.referral.findMany({
      where: {
        patientId: patient.id,
      },
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
        specialist: true,
        appointment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add matched specialists to each referral
    const referralsWithMatches = await Promise.all(
      referrals.map(async (referral) => {
        let matchedSpecialists = [];
        if (referral.matchedSpecialists) {
          const matchedIds = JSON.parse(referral.matchedSpecialists);
          const specialists = await prisma.specialist.findMany({
            where: {
              id: { in: matchedIds.map(m => m.id) },
            },
          });

          matchedSpecialists = specialists.map((specialist) => {
            const matchInfo = matchedIds.find(m => m.id === specialist.id);
            const scores = calculateMatchScore(
              specialist,
              patient.latitude,
              patient.longitude
            );

            return {
              id: specialist.id,
              firstName: specialist.firstName,
              lastName: specialist.lastName,
              specialization: specialist.specialization,
              hospitalName: specialist.hospitalName,
              city: specialist.city,
              state: specialist.state,
              rating: specialist.rating,
              avgWaitDays: specialist.avgWaitDays,
              nextAvailableDate: specialist.nextAvailableDate,
              distance: scores.distance,
              matchScore: matchInfo.matchScore,
            };
          }).sort((a, b) => b.matchScore - a.matchScore);
        }

        return {
          ...referral,
          matchedSpecialists,
        };
      })
    );

    res.status(200).json({ referrals: referralsWithMatches });
  } catch (error) {
    console.error('Get patient referrals error:', error);
    res.status(500).json({ message: 'Error getting patient referrals', error: error.message });
  }
};

export const getDoctorReferrals = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get doctor record
    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor record not found' });
    }

    // Get all referrals created by this doctor
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
        specialist: true,
        appointment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate statistics
    const stats = {
      total: referrals.length,
      pendingSelection: referrals.filter(r => r.status === 'PENDING_SELECTION').length,
      pendingAppointment: referrals.filter(r => r.status === 'PENDING_APPOINTMENT').length,
      scheduled: referrals.filter(r => r.status === 'SCHEDULED').length,
      completed: referrals.filter(r => r.status === 'COMPLETED').length,
      cancelled: referrals.filter(r => r.status === 'CANCELLED').length,
    };

    res.status(200).json({ referrals, stats });
  } catch (error) {
    console.error('Get doctor referrals error:', error);
    res.status(500).json({ message: 'Error getting doctor referrals', error: error.message });
  }
};
