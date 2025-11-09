import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get comprehensive dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    // Get total referrals this month
    const totalReferralsThisMonth = await prisma.referral.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Get total appointments scheduled
    const totalAppointmentsScheduled = await prisma.appointment.count({
      where: {
        status: 'SCHEDULED',
      },
    });

    // Get appointments this week
    const appointmentsThisWeek = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    });

    // Get active doctors count
    const activeDoctors = await prisma.doctor.count();

    // Get referral stats by status
    const referralsByStatus = await prisma.referral.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const statusCounts = {
      PENDING_SELECTION: 0,
      PENDING_APPOINTMENT: 0,
      SCHEDULED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    referralsByStatus.forEach((item) => {
      statusCounts[item.status] = item._count.status;
    });

    // Calculate total referrals and completion metrics
    const totalReferrals = await prisma.referral.count();
    const completedReferrals = statusCounts.COMPLETED;
    const scheduledReferrals = statusCounts.SCHEDULED;
    const acceptedReferrals = statusCounts.PENDING_APPOINTMENT + statusCounts.SCHEDULED + statusCounts.COMPLETED;

    const completionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0;

    // Calculate average time to appointment
    const appointmentsWithReferrals = await prisma.appointment.findMany({
      where: {
        status: {
          in: ['SCHEDULED', 'COMPLETED'],
        },
      },
      include: {
        referral: true,
      },
    });

    let totalDaysToAppointment = 0;
    let appointmentCount = 0;

    appointmentsWithReferrals.forEach((apt) => {
      if (apt.referral) {
        const referralDate = new Date(apt.referral.createdAt);
        const appointmentDate = new Date(apt.createdAt);
        const daysDiff = Math.floor((appointmentDate - referralDate) / (1000 * 60 * 60 * 24));
        totalDaysToAppointment += daysDiff;
        appointmentCount++;
      }
    });

    const avgTimeToAppointment = appointmentCount > 0 ? (totalDaysToAppointment / appointmentCount).toFixed(1) : 0;

    // Get top performing specialties by referral volume
    const specialtyStats = await prisma.referral.groupBy({
      by: ['specialization'],
      _count: {
        specialization: true,
      },
      orderBy: {
        _count: {
          specialization: 'desc',
        },
      },
      take: 5,
    });

    // Calculate completion rate per specialty
    const topSpecialties = await Promise.all(
      specialtyStats.map(async (specialty) => {
        const totalForSpecialty = specialty._count.specialization;
        const completedForSpecialty = await prisma.referral.count({
          where: {
            specialization: specialty.specialization,
            status: 'COMPLETED',
          },
        });

        const completionRate = totalForSpecialty > 0 ? (completedForSpecialty / totalForSpecialty) * 100 : 0;

        return {
          specialty: specialty.specialization,
          referrals: totalForSpecialty,
          completionRate: parseFloat(completionRate.toFixed(1)),
        };
      })
    );

    // Calculate average patient satisfaction (mock for now - would need actual ratings)
    const avgPatientRating = 4.7;

    // Get referral trends for last 6 months
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const referralTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const count = await prisma.referral.count({
        where: {
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      referralTrends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        count,
      });
    }

    res.status(200).json({
      stats: {
        totalReferralsThisMonth,
        totalAppointmentsScheduled,
        appointmentsThisWeek,
        activeDoctors,
        avgPatientRating,
        avgTimeToAppointment: parseFloat(avgTimeToAppointment),
        completionRate: parseFloat(completionRate.toFixed(1)),
      },
      referralMetrics: {
        total: totalReferrals,
        accepted: acceptedReferrals,
        scheduled: scheduledReferrals,
        completed: completedReferrals,
        acceptanceRate: totalReferrals > 0 ? parseFloat(((acceptedReferrals / totalReferrals) * 100).toFixed(1)) : 0,
        scheduledRate: totalReferrals > 0 ? parseFloat(((scheduledReferrals / totalReferrals) * 100).toFixed(1)) : 0,
        completionRate: totalReferrals > 0 ? parseFloat(((completedReferrals / totalReferrals) * 100).toFixed(1)) : 0,
      },
      referralsByStatus: statusCounts,
      topSpecialties,
      referralTrends,
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Error getting dashboard stats', error: error.message });
  }
};

// Get all doctors with performance metrics
export const getDoctorStats = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        createdReferrals: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    const doctorStats = doctors.map((doctor) => {
      const totalReferrals = doctor.createdReferrals.length;
      const completedReferrals = doctor.createdReferrals.filter((r) => r.status === 'COMPLETED').length;
      const completionRate = totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0;

      // Map schema enum to display format
      let status = 'Active';
      if (doctor.status === 'INACTIVE') {
        status = 'Inactive';
      } else if (doctor.status === 'LIMITED_AVAILABILITY') {
        status = 'Limited Availability';
      }

      return {
        id: doctor.id,
        userId: doctor.user.id,
        firstName: doctor.user.firstName,
        lastName: doctor.user.lastName,
        email: doctor.user.email,
        phone: doctor.user.phone,
        specialization: doctor.specialization,
        credentials: doctor.credentials,
        providerId: doctor.providerId,
        npiNumber: doctor.npiNumber,
        hospitalName: doctor.hospitalName,
        address: doctor.address,
        city: doctor.city,
        state: doctor.state,
        zipCode: doctor.zipCode,
        acceptedInsurance: doctor.acceptedInsurance,
        status,
        totalReferrals,
        completionRate: parseFloat(completionRate.toFixed(1)),
        rating: 4.5, // Mock rating - would come from actual patient feedback
        createdAt: doctor.createdAt,
      };
    });

    // Sort by total referrals descending
    doctorStats.sort((a, b) => b.totalReferrals - a.totalReferrals);

    res.status(200).json({ doctors: doctorStats });
  } catch (error) {
    console.error('Error getting doctor stats:', error);
    res.status(500).json({ message: 'Error getting doctor stats', error: error.message });
  }
};

// Update doctor status
export const updateDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Map frontend status names to schema enum values
    const statusMapping = {
      'ACTIVE': 'ACTIVE',
      'LIMITED': 'LIMITED_AVAILABILITY',
      'INACTIVE': 'INACTIVE',
      'LIMITED_AVAILABILITY': 'LIMITED_AVAILABILITY'
    };

    const mappedStatus = statusMapping[status];

    if (!mappedStatus) {
      return res.status(400).json({
        message: 'Valid status is required (ACTIVE, LIMITED, or INACTIVE)'
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: { status: mappedStatus },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: 'Doctor status updated successfully',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error('Error updating doctor status:', error);
    res.status(500).json({ message: 'Error updating doctor status', error: error.message });
  }
};

// Get all doctors (basic list)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({ doctors });
  } catch (error) {
    res.status(500).json({ message: 'Error getting doctors', error: error.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        createdReferrals: {
          include: {
            patient: {
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

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error getting doctor', error: error.message });
  }
};

// Create doctor (stub for future implementation)
export const createDoctor = async (req, res) => {
  try {
    res.status(501).json({ message: 'Create doctor endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
};

// Update doctor (stub for future implementation)
export const updateDoctor = async (req, res) => {
  try {
    res.status(501).json({ message: 'Update doctor endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
};

// Delete doctor (stub for future implementation)
export const deleteDoctor = async (req, res) => {
  try {
    res.status(501).json({ message: 'Delete doctor endpoint - To be implemented' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
};

// Legacy analytics endpoint (redirects to dashboard stats)
export const getAnalytics = async (req, res) => {
  return getDashboardStats(req, res);
};
