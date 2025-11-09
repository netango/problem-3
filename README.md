# HealthConnect

A comprehensive healthcare referral management system that streamlines the process of referring patients to specialist care using intelligent matching algorithms.

## Features

### SMART MATCHING Algorithm
HealthConnect uses an advanced matching algorithm to connect patients with the most suitable specialists based on:
- **Insurance Compatibility** (40% weight) - Ensures specialist accepts patient's insurance
- **Geographic Proximity** (30% weight) - Calculates distance using Haversine formula
- **Availability** (20% weight) - Prioritizes specialists with earlier availability
- **Specialist Performance** (10% weight) - Considers rating and completion rate

### Three Role-Based Portals

#### 1. Doctor Portal
- Create referrals with chief complaint and clinical notes
- View SMART MATCHING results with ranked specialists
- Track referral status through patient journey
- Dashboard with referral statistics
- View all created referrals

#### 2. Patient Portal
- View incoming referrals from doctors
- See matched specialists ranked by compatibility
- Select preferred specialist
- Book appointments with interactive calendar
- View available time slots (30-minute intervals)
- Track appointment status
- Dashboard with upcoming appointments and countdown timers

#### 3. Hospital Admin Portal
- Comprehensive analytics dashboard
  - Total referrals, active doctors, appointments, patient ratings
  - Referral pipeline metrics with completion rates
  - Top performing specialties by volume
  - 6-month referral trend visualization
  - System alerts and notifications
- Doctor management
  - Search and filter by specialty/status
  - View performance metrics (referrals created, completion rate)
  - Update doctor status (Active, Limited Availability, Inactive)
  - View detailed doctor profiles
  - Performance analytics

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API server
- **Prisma ORM** - Database management with SQLite
- **bcryptjs** - Password hashing
- **JWT** - Authentication and authorization
- **ES Modules** - Modern JavaScript syntax

### Frontend
- **React 18** - UI framework with Hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Context API** - State management

### Database Schema
- Users (with role-based authentication)
- Patients (with insurance and location data)
- Doctors (with specialization and status)
- Specialists (with availability and ratings)
- Referrals (with status tracking)
- Appointments (with scheduling)

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Start the development server
npm run dev
\`\`\`

The backend server will start on **http://localhost:3001**

### Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

The frontend will start on **http://localhost:5173**

## Test Credentials

After seeding the database, use these credentials to test different portals:

### Patients
\`\`\`
Email: john.doe@example.com
Password: password123
Insurance: Blue Cross Blue Shield

Email: jane.smith@example.com
Password: password123
Insurance: Aetna

Email: robert.johnson@example.com
Password: password123
Insurance: UnitedHealthcare
\`\`\`

### Doctors
\`\`\`
Email: dr.williams@hospital.com
Password: password123
Specialization: General Practice

Email: dr.martinez@hospital.com
Password: password123
Specialization: Internal Medicine (Limited Availability)

Email: dr.patel@hospital.com
Password: password123
Specialization: Family Medicine
\`\`\`

### Hospital Admin
\`\`\`
Email: admin@hospital.com
Password: password123
\`\`\`

## User Journey Examples

### Complete Patient Journey

1. **Login** as patient (john.doe@example.com)
2. **View Dashboard** - See alert about new referral
3. **Click Referral** - View referral details and matched specialists
4. **Review Specialists** - See ranked list with match scores
5. **Select Specialist** - Choose preferred specialist
6. **Book Appointment** - Use calendar to select date
7. **Choose Time** - Pick from available slots
8. **Confirm** - Review and confirm booking
9. **View Appointments** - See upcoming appointment with countdown
10. **Dashboard** - See appointment reminder on main page

### Complete Doctor Workflow

1. **Login** as doctor (dr.williams@hospital.com)
2. **View Dashboard** - See referral statistics
3. **Create Referral** - Select patient from dropdown
4. **Enter Details** - Add chief complaint, clinical notes, urgency
5. **Select Specialty** - Choose required specialization
6. **Submit** - SMART MATCHING algorithm finds best specialists
7. **View Results** - See top 5 matched specialists with scores
8. **Confirm** - Send referral to patient
9. **Track** - Monitor referral status on dashboard

### Complete Admin Workflow

1. **Login** as admin (admin@hospital.com)
2. **View Analytics** - See comprehensive dashboard
3. **Manage Doctors** - Navigate to doctor management
4. **Search/Filter** - Find doctors by specialty or status
5. **Update Status** - Change doctor availability
6. **View Stats** - Check performance metrics

## SMART MATCHING Algorithm Details

The algorithm calculates a match score (0-100) based on four factors:

- **Insurance Match (40 points)**: 40 if specialist accepts patient's insurance, 0 if not
- **Distance Score (30 points)**: Based on distance (30 pts ≤ 5mi, decreasing to 0 pts > 50mi)
- **Availability Score (20 points)**: Based on nextAvailableDate (sooner = higher score)
- **Performance Score (10 points)**: Rating (0-5) × 1 + Completion Rate (0-100%) × 0.05

## Database Seeding

The seed script creates:
- **3 Patients** (Boston area) with different insurance providers
- **3 Doctors** (various specializations) with different statuses
- **1 Hospital Admin**
- **6 Specialists** (Cardiology, Orthopedics, Neurology, etc.)
- **3 Sample Referrals** in different states

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Referrals
- `GET /api/referrals/patient` - Get patient's referrals
- `GET /api/referrals/doctor` - Get doctor's created referrals
- `GET /api/referrals/:id` - Get referral details with matched specialists
- `POST /api/referrals` - Create new referral (with SMART MATCHING)
- `PUT /api/referrals/:id/select-specialist` - Patient selects specialist
- `PUT /api/referrals/:id/status` - Update referral status

### Appointments
- `GET /api/appointments/available-slots/:specialistId?date=YYYY-MM-DD` - Get available time slots
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/patient` - Get patient's appointments
- `GET /api/appointments/doctor` - Get doctor's appointments
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Admin
- `GET /api/admin/dashboard-stats` - Get dashboard analytics
- `GET /api/admin/doctors` - Get all doctors with performance stats
- `PUT /api/admin/doctors/:id/status` - Update doctor status

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Separate portals with permission checks
- **Input Validation** - Server-side validation on all endpoints
- **SQL Injection Prevention** - Prisma parameterized queries

## License

This project is licensed under the MIT License.

## Built With

Generated with [Claude Code](https://claude.com/claude-code) by Anthropic

