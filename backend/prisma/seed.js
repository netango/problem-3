import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.appointment.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.specialist.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospitalAdmin.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Patients
  console.log('Creating patients...');
  const patient1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      role: 'PATIENT',
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-0101',
      patient: {
        create: {
          dateOfBirth: new Date('1985-05-15'),
          address: '123 Main St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          latitude: 42.3601,
          longitude: -71.0589,
          insuranceProvider: 'Blue Cross Blue Shield',
          insurancePolicyNumber: 'BCBS123456',
        },
      },
    },
    include: {
      patient: true,
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      role: 'PATIENT',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '555-0102',
      patient: {
        create: {
          dateOfBirth: new Date('1990-08-22'),
          address: '456 Oak Ave',
          city: 'Cambridge',
          state: 'MA',
          zipCode: '02139',
          latitude: 42.3736,
          longitude: -71.1097,
          insuranceProvider: 'Aetna',
          insurancePolicyNumber: 'AET789012',
        },
      },
    },
    include: {
      patient: true,
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'robert.johnson@example.com',
      password: hashedPassword,
      role: 'PATIENT',
      firstName: 'Robert',
      lastName: 'Johnson',
      phone: '555-0103',
      patient: {
        create: {
          dateOfBirth: new Date('1978-12-03'),
          address: '789 Pine Rd',
          city: 'Somerville',
          state: 'MA',
          zipCode: '02144',
          latitude: 42.3876,
          longitude: -71.0995,
          insuranceProvider: 'UnitedHealthcare',
          insurancePolicyNumber: 'UHC345678',
        },
      },
    },
    include: {
      patient: true,
    },
  });

  console.log(`✓ Created ${3} patients`);

  // Create Doctors
  console.log('Creating doctors...');
  const doctor1 = await prisma.user.create({
    data: {
      email: 'dr.williams@hospital.com',
      password: hashedPassword,
      role: 'DOCTOR',
      firstName: 'Sarah',
      lastName: 'Williams',
      phone: '555-0201',
      doctor: {
        create: {
          specialization: 'General Practice',
          licenseNumber: 'MD12345',
          hospitalName: 'Massachusetts General Hospital',
          department: 'Primary Care',
        },
      },
    },
    include: {
      doctor: true,
    },
  });

  const doctor2 = await prisma.user.create({
    data: {
      email: 'dr.martinez@hospital.com',
      password: hashedPassword,
      role: 'DOCTOR',
      firstName: 'Carlos',
      lastName: 'Martinez',
      phone: '555-0202',
      doctor: {
        create: {
          specialization: 'Internal Medicine',
          licenseNumber: 'MD67890',
          hospitalName: 'Brigham and Women\'s Hospital',
          department: 'Internal Medicine',
          status: 'LIMITED_AVAILABILITY',
        },
      },
    },
    include: {
      doctor: true,
    },
  });

  const doctor3 = await prisma.user.create({
    data: {
      email: 'dr.patel@hospital.com',
      password: hashedPassword,
      role: 'DOCTOR',
      firstName: 'Priya',
      lastName: 'Patel',
      phone: '555-0203',
      doctor: {
        create: {
          specialization: 'Family Medicine',
          licenseNumber: 'MD54321',
          hospitalName: 'Beth Israel Deaconess Medical Center',
          department: 'Family Medicine',
        },
      },
    },
    include: {
      doctor: true,
    },
  });

  console.log(`✓ Created ${3} doctors`);

  // Create Hospital Admin
  console.log('Creating hospital admin...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hospital.com',
      password: hashedPassword,
      role: 'HOSPITAL_ADMIN',
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '555-0301',
      hospitalAdmin: {
        create: {
          hospitalName: 'Massachusetts General Hospital',
          department: 'Administration',
        },
      },
    },
  });

  console.log(`✓ Created ${1} hospital admin`);

  // Create Specialists
  console.log('Creating specialists...');
  const specialists = [
    // CARDIOLOGY SPECIALISTS (5)
    {
      firstName: 'Emily',
      lastName: 'Anderson',
      specialization: 'Cardiology',
      email: 'e.anderson@specialist.com',
      phone: '555-1001',
      hospitalName: 'Massachusetts General Hospital',
      address: '55 Fruit St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3635,
      longitude: -71.0686,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
      availableHours: '9:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-15'),
      rating: 4.8,
      completionRate: 0.95,
      avgWaitDays: 5,
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      specialization: 'Cardiology',
      email: 'j.wilson@specialist.com',
      phone: '555-1006',
      hospitalName: 'Brigham and Women\'s Hospital',
      address: '75 Francis St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      latitude: 42.3360,
      longitude: -71.1070,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare']),
      availableDays: JSON.stringify(['Monday', 'Thursday', 'Friday']),
      availableHours: '7:00 AM - 3:00 PM',
      nextAvailableDate: new Date('2025-11-10'),
      rating: 4.8,
      completionRate: 0.96,
      avgWaitDays: 2,
    },
    {
      firstName: 'Rachel',
      lastName: 'Thompson',
      specialization: 'Cardiology',
      email: 'r.thompson@specialist.com',
      phone: '555-1007',
      hospitalName: 'Beth Israel Deaconess Medical Center',
      address: '330 Brookline Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02215',
      latitude: 42.3386,
      longitude: -71.1062,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'UnitedHealthcare', 'Medicare']),
      availableDays: JSON.stringify(['Tuesday', 'Wednesday', 'Thursday']),
      availableHours: '8:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-14'),
      rating: 4.7,
      completionRate: 0.93,
      avgWaitDays: 6,
    },
    {
      firstName: 'Thomas',
      lastName: 'Chen',
      specialization: 'Cardiology',
      email: 't.chen@specialist.com',
      phone: '555-1008',
      hospitalName: 'Tufts Medical Center',
      address: '800 Washington St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02111',
      latitude: 42.3493,
      longitude: -71.0639,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Friday']),
      availableHours: '9:00 AM - 6:00 PM',
      nextAvailableDate: new Date('2025-11-11'),
      rating: 4.9,
      completionRate: 0.97,
      avgWaitDays: 4,
    },
    {
      firstName: 'Daniel',
      lastName: 'Kim',
      specialization: 'Cardiology',
      email: 'd.kim@specialist.com',
      phone: '555-1010',
      hospitalName: 'Boston Medical Center',
      address: '1 Boston Medical Center Pl',
      city: 'Boston',
      state: 'MA',
      zipCode: '02118',
      latitude: 42.3365,
      longitude: -71.0728,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'UnitedHealthcare', 'Aetna', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Thursday', 'Friday']),
      availableHours: '7:30 AM - 4:30 PM',
      nextAvailableDate: new Date('2025-11-09'),
      rating: 4.9,
      completionRate: 0.98,
      avgWaitDays: 1,
    },

    // ORTHOPEDICS SPECIALISTS (2)
    {
      firstName: 'David',
      lastName: 'Lee',
      specialization: 'Orthopedics',
      email: 'd.lee@specialist.com',
      phone: '555-1002',
      hospitalName: 'Brigham and Women\'s Hospital',
      address: '75 Francis St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      latitude: 42.3360,
      longitude: -71.1070,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare']),
      availableDays: JSON.stringify(['Tuesday', 'Thursday', 'Saturday']),
      availableHours: '8:00 AM - 4:00 PM',
      nextAvailableDate: new Date('2025-11-12'),
      rating: 4.9,
      completionRate: 0.98,
      avgWaitDays: 3,
    },
    {
      firstName: 'Robert',
      lastName: 'Harris',
      specialization: 'Orthopedics',
      email: 'r.harris@specialist.com',
      phone: '555-1011',
      hospitalName: 'Massachusetts General Hospital',
      address: '55 Fruit St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3630,
      longitude: -71.0690,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
      availableHours: '8:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-13'),
      rating: 4.7,
      completionRate: 0.94,
      avgWaitDays: 5,
    },

    // OPHTHALMOLOGY SPECIALISTS (2)
    {
      firstName: 'Patricia',
      lastName: 'Martinez',
      specialization: 'Ophthalmology',
      email: 'p.martinez@specialist.com',
      phone: '555-1009',
      hospitalName: 'Massachusetts Eye and Ear',
      address: '243 Charles St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3619,
      longitude: -71.0693,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
      availableHours: '8:00 AM - 4:00 PM',
      nextAvailableDate: new Date('2025-11-16'),
      rating: 4.8,
      completionRate: 0.94,
      avgWaitDays: 8,
    },
    {
      firstName: 'Steven',
      lastName: 'Park',
      specialization: 'Ophthalmology',
      email: 's.park@specialist.com',
      phone: '555-1012',
      hospitalName: 'Beth Israel Deaconess Medical Center',
      address: '330 Brookline Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02215',
      latitude: 42.3390,
      longitude: -71.1065,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'UnitedHealthcare']),
      availableDays: JSON.stringify(['Tuesday', 'Thursday', 'Saturday']),
      availableHours: '9:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-19'),
      rating: 4.6,
      completionRate: 0.91,
      avgWaitDays: 10,
    },

    // DERMATOLOGY SPECIALISTS (2)
    {
      firstName: 'Jennifer',
      lastName: 'Taylor',
      specialization: 'Dermatology',
      email: 'j.taylor@specialist.com',
      phone: '555-1003',
      hospitalName: 'Beth Israel Deaconess Medical Center',
      address: '330 Brookline Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02215',
      latitude: 42.3386,
      longitude: -71.1062,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Humana']),
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Thursday']),
      availableHours: '10:00 AM - 6:00 PM',
      nextAvailableDate: new Date('2025-11-20'),
      rating: 4.7,
      completionRate: 0.92,
      avgWaitDays: 10,
    },
    {
      firstName: 'Amanda',
      lastName: 'Rodriguez',
      specialization: 'Dermatology',
      email: 'a.rodriguez@specialist.com',
      phone: '555-1013',
      hospitalName: 'Boston Medical Center',
      address: '1 Boston Medical Center Pl',
      city: 'Boston',
      state: 'MA',
      zipCode: '02118',
      latitude: 42.3370,
      longitude: -71.0725,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Medicare', 'Medicaid']),
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
      availableHours: '9:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-17'),
      rating: 4.5,
      completionRate: 0.88,
      avgWaitDays: 12,
    },

    // NEUROLOGY SPECIALISTS (2)
    {
      firstName: 'Michael',
      lastName: 'Brown',
      specialization: 'Neurology',
      email: 'm.brown@specialist.com',
      phone: '555-1004',
      hospitalName: 'Massachusetts General Hospital',
      address: '55 Fruit St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3635,
      longitude: -71.0686,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'UnitedHealthcare', 'Medicare', 'Aetna']),
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
      availableHours: '9:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-18'),
      rating: 4.9,
      completionRate: 0.97,
      avgWaitDays: 7,
    },
    {
      firstName: 'Sarah',
      lastName: 'Mitchell',
      specialization: 'Neurology',
      email: 's.mitchell@specialist.com',
      phone: '555-1014',
      hospitalName: 'Brigham and Women\'s Hospital',
      address: '75 Francis St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      latitude: 42.3365,
      longitude: -71.1065,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna']),
      availableDays: JSON.stringify(['Tuesday', 'Thursday']),
      availableHours: '8:00 AM - 4:00 PM',
      nextAvailableDate: new Date('2025-11-21'),
      rating: 4.6,
      completionRate: 0.90,
      avgWaitDays: 9,
    },

    // ENDOCRINOLOGY SPECIALISTS (2)
    {
      firstName: 'Lisa',
      lastName: 'Garcia',
      specialization: 'Endocrinology',
      email: 'l.garcia@specialist.com',
      phone: '555-1005',
      hospitalName: 'Tufts Medical Center',
      address: '800 Washington St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02111',
      latitude: 42.3493,
      longitude: -71.0639,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare']),
      availableDays: JSON.stringify(['Tuesday', 'Wednesday', 'Thursday']),
      availableHours: '8:30 AM - 4:30 PM',
      nextAvailableDate: new Date('2025-11-22'),
      rating: 4.6,
      completionRate: 0.89,
      avgWaitDays: 12,
    },
    {
      firstName: 'Kevin',
      lastName: 'White',
      specialization: 'Endocrinology',
      email: 'k.white@specialist.com',
      phone: '555-1015',
      hospitalName: 'Massachusetts General Hospital',
      address: '55 Fruit St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3640,
      longitude: -71.0680,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Friday']),
      availableHours: '9:00 AM - 3:00 PM',
      nextAvailableDate: new Date('2025-11-25'),
      rating: 4.4,
      completionRate: 0.86,
      avgWaitDays: 14,
    },

    // GASTROENTEROLOGY SPECIALISTS (2) - NEW
    {
      firstName: 'Jennifer',
      lastName: 'Roberts',
      specialization: 'Gastroenterology',
      email: 'j.roberts@specialist.com',
      phone: '555-1016',
      hospitalName: 'Boston Medical Center',
      address: '1 Boston Medical Center Pl',
      city: 'Boston',
      state: 'MA',
      zipCode: '02118',
      latitude: 42.3360,
      longitude: -71.0730,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Friday']),
      availableHours: '8:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-18'),
      rating: 4.7,
      completionRate: 0.91,
      avgWaitDays: 5,
    },
    {
      firstName: 'Christopher',
      lastName: 'Young',
      specialization: 'Gastroenterology',
      email: 'c.young@specialist.com',
      phone: '555-1017',
      hospitalName: 'Brigham and Women\'s Hospital',
      address: '75 Francis St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      latitude: 42.3355,
      longitude: -71.1075,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Cigna']),
      availableDays: JSON.stringify(['Tuesday', 'Thursday', 'Friday']),
      availableHours: '9:00 AM - 4:00 PM',
      nextAvailableDate: new Date('2025-11-23'),
      rating: 4.5,
      completionRate: 0.87,
      avgWaitDays: 11,
    },

    // PULMONOLOGY SPECIALISTS (2) - NEW
    {
      firstName: 'Rebecca',
      lastName: 'Lewis',
      specialization: 'Pulmonology',
      email: 'r.lewis@specialist.com',
      phone: '555-1018',
      hospitalName: 'Massachusetts General Hospital',
      address: '55 Fruit St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3625,
      longitude: -71.0688,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Medicare']),
      availableDays: JSON.stringify(['Monday', 'Wednesday', 'Thursday']),
      availableHours: '8:00 AM - 5:00 PM',
      nextAvailableDate: new Date('2025-11-19'),
      rating: 4.8,
      completionRate: 0.95,
      avgWaitDays: 6,
    },
    {
      firstName: 'Brian',
      lastName: 'Thompson',
      specialization: 'Pulmonology',
      email: 'b.thompson@specialist.com',
      phone: '555-1019',
      hospitalName: 'Beth Israel Deaconess Medical Center',
      address: '330 Brookline Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02215',
      latitude: 42.3380,
      longitude: -71.1068,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Medicaid']),
      availableDays: JSON.stringify(['Tuesday', 'Friday']),
      availableHours: '9:00 AM - 3:00 PM',
      nextAvailableDate: new Date('2025-11-26'),
      rating: 4.3,
      completionRate: 0.84,
      avgWaitDays: 15,
    },

    // PSYCHIATRY SPECIALISTS (1) - NEW
    {
      firstName: 'Michelle',
      lastName: 'Davis',
      specialization: 'Psychiatry',
      email: 'm.davis@specialist.com',
      phone: '555-1020',
      hospitalName: 'Massachusetts General Hospital',
      address: '55 Fruit St',
      city: 'Boston',
      state: 'MA',
      zipCode: '02114',
      latitude: 42.3628,
      longitude: -71.0692,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare']),
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
      availableHours: '9:00 AM - 6:00 PM',
      nextAvailableDate: new Date('2025-11-15'),
      rating: 4.9,
      completionRate: 0.96,
      avgWaitDays: 4,
    },

    // ONCOLOGY SPECIALISTS (1) - NEW
    {
      firstName: 'William',
      lastName: 'Anderson',
      specialization: 'Oncology',
      email: 'w.anderson@specialist.com',
      phone: '555-1021',
      hospitalName: 'Dana-Farber Cancer Institute',
      address: '450 Brookline Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02215',
      latitude: 42.3380,
      longitude: -71.1070,
      acceptedInsurance: JSON.stringify(['Blue Cross Blue Shield', 'Aetna', 'Medicare', 'UnitedHealthcare']),
      availableDays: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
      availableHours: '8:00 AM - 6:00 PM',
      nextAvailableDate: new Date('2025-11-13'),
      rating: 4.9,
      completionRate: 0.98,
      avgWaitDays: 3,
    },
  ];

  for (const specialist of specialists) {
    await prisma.specialist.create({ data: specialist });
  }

  console.log(`✓ Created ${specialists.length} specialists`);
  console.log('  - Cardiology: 5');
  console.log('  - Orthopedics: 2');
  console.log('  - Ophthalmology: 2');
  console.log('  - Dermatology: 2');
  console.log('  - Neurology: 2');
  console.log('  - Endocrinology: 2');
  console.log('  - Gastroenterology: 2');
  console.log('  - Pulmonology: 2');
  console.log('  - Psychiatry: 1');
  console.log('  - Oncology: 1');
  console.log('  ✓ ALL accept Blue Cross Blue Shield insurance');

  // Create Sample Referrals
  console.log('Creating sample referrals...');

  // Get created specialists
  const allSpecialists = await prisma.specialist.findMany();
  const cardiologySpecialist = allSpecialists.find(s => s.specialization === 'Cardiology');

  // Referral 1: Pending Selection (John Doe - needs cardiologist)
  await prisma.referral.create({
    data: {
      patientId: patient1.patient.id,
      doctorId: doctor1.doctor.id,
      specialization: 'Cardiology',
      chiefComplaint: 'Chest pain and shortness of breath',
      clinicalNotes: 'Patient reports intermittent chest pain for 2 weeks. ECG shows minor abnormalities. Recommend cardiology evaluation.',
      urgency: 'High',
      status: 'PENDING_SELECTION',
    },
  });

  // Referral 2: Pending Appointment (Jane Smith - selected orthopedist)
  const orthopedicsSpecialist = allSpecialists.find(s => s.specialization === 'Orthopedics');
  await prisma.referral.create({
    data: {
      patientId: patient2.patient.id,
      doctorId: doctor2.doctor.id,
      specialistId: orthopedicsSpecialist.id,
      specialization: 'Orthopedics',
      chiefComplaint: 'Chronic knee pain',
      clinicalNotes: 'Patient has persistent knee pain after running injury 3 months ago. X-rays show possible meniscal tear.',
      urgency: 'Medium',
      status: 'PENDING_APPOINTMENT',
    },
  });

  // Referral 3: Scheduled (Robert Johnson - has appointment)
  const neurologySpecialist = allSpecialists.find(s => s.specialization === 'Neurology');
  await prisma.referral.create({
    data: {
      patientId: patient3.patient.id,
      doctorId: doctor3.doctor.id,
      specialistId: neurologySpecialist.id,
      specialization: 'Neurology',
      chiefComplaint: 'Recurring migraines',
      clinicalNotes: 'Patient experiences severe migraines 3-4 times per week. Not responding well to current medication.',
      urgency: 'Medium',
      status: 'SCHEDULED',
    },
  });

  console.log(`✓ Created ${3} sample referrals`);

  console.log('\n✅ Database seed completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('─────────────────────────────────────');
  console.log('Patient 1:');
  console.log('  Email: john.doe@example.com');
  console.log('  Password: password123');
  console.log('  Insurance: Blue Cross Blue Shield\n');
  console.log('Patient 2:');
  console.log('  Email: jane.smith@example.com');
  console.log('  Password: password123');
  console.log('  Insurance: Aetna\n');
  console.log('Patient 3:');
  console.log('  Email: robert.johnson@example.com');
  console.log('  Password: password123');
  console.log('  Insurance: UnitedHealthcare\n');
  console.log('Doctor 1:');
  console.log('  Email: dr.williams@hospital.com');
  console.log('  Password: password123\n');
  console.log('Doctor 2:');
  console.log('  Email: dr.martinez@hospital.com');
  console.log('  Password: password123\n');
  console.log('Doctor 3:');
  console.log('  Email: dr.patel@hospital.com');
  console.log('  Password: password123\n');
  console.log('Hospital Admin:');
  console.log('  Email: admin@hospital.com');
  console.log('  Password: password123');
  console.log('─────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
