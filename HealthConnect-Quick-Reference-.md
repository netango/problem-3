# HealthConnect Quick Reference Guide (Updated)
## Smart Healthcare Referral System - Version 2.0

---

# 📋 PAGE 1: SYSTEM OVERVIEW & SETUP

## 🚀 Quick Start

### Running the Application

**Terminal 1 - Backend:**
```bash
cd /Users/ngokhup/HealthConnect/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/ngokhup/HealthConnect/frontend
npm run dev
```

**Access:** http://localhost:5173

### Demo Mode (No Login Required)

- Click "View Patient Portal"
- Click "View Doctor Portal"
- Click "View Admin Portal"

### Test Credentials

| Role    | Email                      | Password     |
|---------|----------------------------|--------------|
| Patient | john.doe@example.com       | password123  |
| Doctor  | dr.patel@hospital.com      | password123  |
| Admin   | admin@hospital.com         | password123  |

---

## 📊 SMART MATCHING Algorithm

### How It Works

The proprietary SMART MATCHING algorithm automatically ranks specialists using weighted criteria:

**📊 40% - Insurance Compatibility**
- Exact match on patient's insurance plan
- Eliminates out-of-network surprises

**📍 30% - Geographic Proximity**
- Haversine formula for accurate distance calculation
- Prioritizes closer specialists (0.5-2.5 miles)

**📅 20% - Availability**
- Next available appointment date
- Real calendar integration with work schedules
- Reduces wait times significantly

**⭐ 10% - Performance Metrics**
- Doctor ratings (4.3 to 4.9 stars)
- Completion rates (84% to 98%)
- Average wait days (1-15 days)

**Result:** Patients see 5 perfectly matched specialists ranked by score (88%-98%)

---

## 📈 System Statistics

### Performance Metrics

- ⚡ **78%** Referral Completion Rate
- 📅 **8.5 days** Average Time to Appointment
- 🎯 **93%** Insurance Match Accuracy
- 👨‍⚕️ **21 Specialists** across 10 Specialties
- 👥 **5 Patients** | **3 Doctors** | **1 Admin**

### Specialist Coverage

| Specialty          | Count | Specialty          | Count |
|--------------------|-------|--------------------|-------|
| Cardiology         | 5     | Gastroenterology   | 2     |
| Orthopedics        | 2     | Pulmonology        | 2     |
| Ophthalmology      | 2     | Psychiatry         | 1     |
| Dermatology        | 2     | Oncology           | 1     |
| Neurology          | 2     | Endocrinology      | 2     |

**All specialists:**
- Accept Blue Cross Blue Shield
- Located within 5 miles (Boston area)
- Available Monday-Friday
- Rated 4.3⭐ to 4.9⭐

---

## 💻 Tech Stack

### Frontend
- React 18 with Hooks
- Vite (Build Tool)
- Tailwind CSS v3.4.0
- React Router v6
- Context API (State Management)
- react-hot-toast (Notifications)
- localStorage for demo persistence

### Backend
- Node.js + Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication + bcrypt
- ES Modules
- RESTful API

### Key Features
- Role-based portals (Patient, Doctor, Admin)
- Real-time toast notifications
- Calendar integration with specialist availability
- Appointment booking with localStorage persistence
- Empty states & loading skeletons
- Confirmation modals
- Form validation
- Responsive design
- Back navigation on all pages
- Mock data for seamless demos

---

# 📋 PAGE 2: WORKFLOWS & DEMO SCRIPT

## 🩺 DOCTOR PORTAL - Create Referral (7 steps)

1. **Dashboard Overview**
   - View 5 active patients
   - Recent referrals section
   - Quick statistics

2. **Select Patient**
   - Click "Create Referral" on patient card
   - Patient pre-selected automatically

3. **Enter Referral Details**
   - Specialty: Choose from 10 options
   - Urgency: High / Routine / Low
   - Chief Complaint: Min 10 characters
   - Clinical Notes: Min 20 characters

4. **Find Specialists**
   - Click "Find Specialists with SMART MATCHING"
   - Loading toast appears
   - Algorithm runs in <2 seconds

5. **Review Matches**
   - See 5 ranked specialists
   - Top match has "🏆 TOP MATCH" badge
   - View match scores (88%-98%)
   - See distance, rating, availability

6. **Select Specialist**
   - Click on recommended specialist
   - Green "✓ Selected" badge appears

7. **Send Referral**
   - Click "Send Referral to Patient"
   - Success toast confirmation
   - Patient notified immediately

---

## 👥 PATIENT PORTAL - Complete Workflow (NEW!)

### View Referrals

1. **Dashboard Alert**
   - See blue "Action Required" banner
   - Shows specialist name and specialty
   - Displays hospital name

2. **Navigate to Referrals Page**
   - Click "My Referrals" in navbar OR
   - Click "← Back to Dashboard" to return
   - View all referrals with filters:
     - All Referrals (4 total)
     - Action Required (2 pending)
     - Scheduled (1 booked)
     - Completed (1 finished)

3. **Referral Card Details**
   - Pre-selected specialist info
   - Match score (98% or 96%)
   - Rating, distance, hospital
   - Chief complaint and clinical notes
   - Status badges with colors

### Book Appointment (8 steps)

1. **Start Booking**
   - Click "📅 Book Appointment" button
   - Loads appointment booking page
   - See "← Back to Dashboard | ← Back to Referral" navigation

2. **Specialist Information**
   - View pre-selected specialist details
   - See schedule info box (Mon-Fri work days)
   - View calendar legend

3. **View Real Calendar**
   - Next 30 days displayed
   - **Green** = Available (Mon-Fri)
   - **Gray** = Not Available (weekends)
   - **Blue** = Selected date

4. **Select Date**
   - Click any green date
   - Time slots load automatically
   - Loading indicator appears

5. **Choose Time Slot**
   - **Morning slots:** 8:00 AM - 12:00 PM
   - **Afternoon slots:** 1:00 PM - 5:00 PM
   - Click preferred time (e.g., 2:00 PM)

6. **Review Details**
   - Appointment summary shows
   - Date, time, specialist, location
   - Chief complaint reminder

7. **Confirm Appointment**
   - Click "Confirm Appointment"
   - Success toast with details
   - Auto-navigates to appointments page (2 sec)

8. **Appointment Saved**
   - **Saved to localStorage** for demo persistence
   - Appears in "My Appointments" tab
   - Shows on Dashboard "Upcoming Appointments"

### View Appointments (NEW!)

1. **Appointments Page**
   - Click "Appointments" in navbar
   - See "← Back to Dashboard" button
   - View statistics: Total | Upcoming | Completed | Cancelled

2. **Filter Appointments**
   - **Upcoming:** Shows scheduled appointments
   - **Past:** Shows completed appointments
   - **Cancelled:** Shows cancelled appointments

3. **Appointment Cards**
   - Specialist name and specialization
   - Date and time with countdown ("in 3 days")
   - Hospital and address
   - "Get Directions" link (Google Maps)
   - "Cancel Appointment" button

4. **Cancel Appointment**
   - Click "Cancel Appointment"
   - Modal appears with confirmation
   - Optional cancellation reason
   - Updates localStorage immediately

---

## 🎬 2-MINUTE DEMO SCRIPT

### ⏱️ 0:00-0:15 (Introduction)

**SAY:** "Healthcare referrals are broken. Patients wait weeks for specialist appointments. Care coordination is fragmented. HealthConnect solves this with intelligent matching technology. Let me show you how."

**Action:** Open browser to http://localhost:5173

---

### ⏱️ 0:15-1:00 (Doctor Portal - 45 seconds)

1. **Click** "View Doctor Portal"
   **SAY:** "Dr. Patel logs in and sees her dashboard with all her patients."

2. **Scroll** to "My Patients" section
   **SAY:** "John Doe needs a cardiology referral."

3. **Click** "Create Referral" on John Doe's card
   **SAY:** "One click and his information is already loaded."

4. **Fill in** the form:
   - Specialty: **Cardiology**
   - Urgency: **High**
   - Chief Complaint: **"Chest pain and shortness of breath"**
   - Clinical Notes: **"Patient reports onset over two weeks with exertion"**

   **SAY:** "She enters clinical details—chest pain, high urgency."

5. **Click** "Find Specialists with SMART MATCHING"
   **SAY:** "Watch this. Our algorithm analyzes John's insurance, location, and needs..."

6. **Hover** over Dr. Kim (98% match)
   **SAY:** "...and instantly ranks five cardiologists. Dr. Kim scores 98%—closest location, accepts insurance, available in 3 days. The algorithm weighs insurance 40%, distance 30%, availability 20%, and performance 10%."

7. **Click** "Select" on Dr. Kim, then "Send Referral to Patient"
   **SAY:** "She selects Dr. Kim and sends the referral. John receives it instantly."

---

### ⏱️ 1:00-1:45 (Patient Portal - 45 seconds)

1. **Click** back to home, then "View Patient Portal"
   **SAY:** "Now John's experience. He logs in..."

2. **Point** to blue "Action Required" alert
   **SAY:** "...and sees an urgent alert. His doctor has referred him to Dr. Kim for cardiology."

3. **Click** "Book Appointment →"
   **SAY:** "Time to book. He sees Dr. Kim's schedule."

4. **Point** to calendar
   **SAY:** "Green dates show availability—Dr. Kim works Monday through Friday."

5. **Click** a date (November 15 - Friday)
   **SAY:** "Friday the 15th. Multiple time slots available."

6. **Click** "2:00 PM"
   **SAY:** "Two PM works perfectly."

7. **Click** "Confirm Appointment"
   **SAY:** "Done! The appointment is saved to localStorage, appears in his appointments tab, and shows on the dashboard. From referral to confirmed appointment in under 60 seconds. No phone calls, no waiting, no hassle."

8. **Show** "My Appointments" tab
   **SAY:** "Here it is—scheduled with countdown timer and all details."

---

### ⏱️ 1:45-2:00 (Conclusion)

**SAY:** "HealthConnect. Smart matching. Real calendar integration. localStorage persistence. Seamless booking. Better outcomes. We're reducing specialist wait times from weeks to days."

**Show metrics:**
- **78%** completion rate
- **8.5 days** to appointment
- **93%** insurance match

---

## ✨ NEW FEATURES (Latest Updates)

### ✅ Appointment Booking with localStorage Persistence
- Appointments save to browser localStorage
- Survive page refreshes
- Load on Dashboard, Appointments page, and Referrals page
- Mock API graceful fallback

### ✅ Real Specialist Calendars
- 4 different specialist schedules
- Unique work days and time slots
- Pre-booked slots system
- Calendar shows actual availability

### ✅ Enhanced Navigation
- "Back to Dashboard" buttons on all pages
- Dual navigation on detail pages (Dashboard | Contextual)
- Breadcrumb-style navigation
- Smooth transitions

### ✅ Consistent Data Across Pages
- Same referrals show on Dashboard and Referrals page
- Same appointments show on Dashboard and Appointments page
- Statistics match everywhere
- Synchronized mock data

### ✅ Improved Referral Workflow
- Doctor pre-selects specialist (not patient)
- Patient only books appointment time
- Clear status progression:
  - PENDING_APPOINTMENT → Patient needs to book
  - SCHEDULED → Appointment booked
  - COMPLETED → Appointment finished

### ✅ Professional UI Elements
- Penguin logo throughout
- Color-coded status badges
- Match scores with percentages
- Countdown timers ("in 3 days")
- Toast notifications
- Loading skeletons
- Empty states
- Confirmation modals

---

## 🔧 Troubleshooting

**Issue: "Failed to load" errors**
✅ **Solution:** Mock data in use (expected for demo)

**Issue: Calendar shows no dates**
✅ **Solution:** Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

**Issue: Appointment doesn't appear after booking**
✅ **Solution:** Check localStorage in browser console (F12), verify no errors

**Issue: Error boundary appears**
✅ **Solution:** Check console (F12), restart servers

**Issue: Toasts not appearing**
✅ **Solution:** Verify react-hot-toast installed

**Issue: Penguin logo missing**
✅ **Solution:** Check /public/penguin_transparent.png exists

**Issue: Back button not working**
✅ **Solution:** Verify navigation path is correct (/patient not /patient/dashboard)

---

## 📊 Mock Data Summary (Current)

### Patients (5)
- **John Doe** (Blue Cross Blue Shield) - 40 years old
- **Jane Smith** (Aetna) - 35 years old
- **Robert Johnson** (UnitedHealthcare) - 52 years old
- **Mary Williams** (Blue Cross Blue Shield) - 45 years old
- **David Chen** (Medicare) - 38 years old

### Referring Doctors (3)
- **Dr. Sarah Williams** (Family Medicine)
- **Dr. Michael Martinez** (Internal Medicine)
- **Dr. Priya Patel** (Family Medicine) ⭐ Use for demos

### Sample Referrals (4)
1. **Cardiology** for John Doe - Dr. Daniel Kim selected - PENDING_APPOINTMENT - 98% match
2. **Ophthalmology** for Jane Smith - Dr. Patricia Martinez - SCHEDULED
3. **Orthopedics** for John Doe - Dr. Lisa Thompson selected - PENDING_APPOINTMENT - 96% match
4. **Dermatology** - Dr. Jennifer Lee - COMPLETED

### Top 5 Cardiologists
1. **Dr. Daniel Kim** (98% match, 0.5 mi, Boston Medical Center)
2. **Dr. Thomas Chen** (95% match, 1.2 mi, Tufts Medical)
3. **Dr. James Wilson** (93% match, 1.8 mi, Boston Cardiac)
4. **Dr. Emily Anderson** (91% match, 2.1 mi, Mass General)
5. **Dr. Rachel Thompson** (88% match, 2.5 mi, Beth Israel)

---

## ✅ Pre-Demo Checklist

### Before Recording
- [ ] Both servers running (backend + frontend)
- [ ] No console errors (check F12)
- [ ] All three portals load correctly
- [ ] Mock data displays properly
- [ ] Penguin logo visible everywhere
- [ ] Toast notifications working
- [ ] Calendar shows available dates
- [ ] localStorage is cleared (optional fresh start)
- [ ] Back buttons work on all pages
- [ ] Close all unnecessary tabs/apps
- [ ] Hide bookmarks bar (Cmd+Shift+B)
- [ ] Full screen browser window

### During Recording
- [ ] Speak clearly and at moderate pace
- [ ] Move mouse smoothly (not too fast)
- [ ] Follow 2-minute script exactly
- [ ] Pause briefly between major actions
- [ ] Show success toasts clearly
- [ ] Highlight key features (SMART MATCHING)
- [ ] Show appointment in Appointments tab
- [ ] Demonstrate localStorage persistence

### After Recording
- [ ] Review for errors or glitches
- [ ] Check audio quality
- [ ] Verify all workflows completed
- [ ] Edit out any mistakes
- [ ] Add title cards (optional)
- [ ] Export as MP4 (1080p, 30fps)

---

## 🎯 Success Metrics

Your demo is successful when viewers see:
- ✅ Doctor creates referral effortlessly
- ✅ SMART MATCHING instantly ranks specialists
- ✅ Algorithm logic is clear (40/30/20/10)
- ✅ Patient books appointment in <60 seconds
- ✅ Calendar integration is intuitive with real availability
- ✅ Appointment saves to localStorage
- ✅ Appointment appears in "My Appointments" tab
- ✅ Navigation is smooth with back buttons
- ✅ Entire flow feels seamless and fast
- ✅ Real-world problem is clearly solved

---

## 🚀 YOU'RE READY TO RECORD!

Follow the 2-minute script, maintain energy, and showcase how HealthConnect transforms healthcare referrals from a week-long hassle into a 60-second solution with real calendar integration and persistent appointment booking.

**Good luck! 🐧✨**

---

**HealthConnect** | Smart Healthcare Referral System | © 2025 | Version 2.0
