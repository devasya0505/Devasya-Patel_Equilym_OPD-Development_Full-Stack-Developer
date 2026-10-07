# 🚀 EquiCare OPD — Complete Step-by-Step Execution & Verification Guide

This guide gives you the exact commands to run from a clean terminal, along with the **Expected Output** at every single step.

---

## 📑 Summary of Ports & URLs

| Component | Port | URL | Role |
| :--- | :--- | :--- | :--- |
| **MySQL / MariaDB** | `3306` | `localhost:3306/opd_db` | Relational Database |
| **Spring Boot Backend** | `8080` | `http://localhost:8080/api/...` | REST API Server |
| **Angular Frontend** | `4200` | `http://localhost:4200` | Single Page Application |

---

## 👣 STEP 1: Start MySQL Database

### Command:
Open XAMPP Control Panel and click **Start** next to MySQL, or run via PowerShell:
```powershell
mysql -u root -e "CREATE DATABASE IF NOT EXISTS opd_db; SHOW DATABASES;"
```

### ✅ Expected Console Output:
```text
Database
information_schema
mysql
opd_db
performance_schema
phpmyadmin
test
```
> **What this means:** MySQL is active on port 3306 and the `opd_db` database is ready for Spring Boot.

---

## 👣 STEP 2: Start the Spring Boot Backend

### Command:
Open a **new terminal / PowerShell window**:
```powershell
cd "e:\0_Study\PLACEMENTS\TECHNICAL ASSESSMENT\OPD-Development_Equilym\backend"
.\mvnw.cmd spring-boot:run
```
*(On Linux/macOS, use `./mvnw spring-boot:run`)*

### ✅ Expected Console Output:
```text
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.0.0)

2026-10-07T... INFO ... Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-10-07T... INFO ... Finished Spring Data repository scanning in 9 ms. Found 3 JPA repository interfaces.
2026-10-07T... INFO ... Tomcat started on port 8080 (http) with context path '/'
2026-10-07T... INFO ... Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-10-07T... INFO ... Seeding initial OPD demo data...
2026-10-07T... INFO ... OPD Demo Data successfully initialized!
2026-10-07T... INFO ... Started OpdBackendApplication in 2.1 seconds
```

### 🔍 Verification (Optional Quick Test):
In another terminal, test if the API is responding:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/patients"
```
**Expected Response:** A JSON array containing the 4 initial demo patients (`Aarav Sharma`, `Priya Patel`, `Rohan Mehta`, `Sunita Rao`).

---

## 👣 STEP 3: Start the Angular Frontend

### Command:
Open a **second terminal / PowerShell window**:
```powershell
cd "e:\0_Study\PLACEMENTS\TECHNICAL ASSESSMENT\OPD-Development_Equilym\frontend"
npm start
```

### ✅ Expected Console Output:
```text
> frontend@0.0.0 start
> ng serve

Application bundle generation complete. [1.2 seconds]
Watch mode enabled. Watching for file changes...
NOTE: Raw file changes are sync'd.

  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

---

## 👣 STEP 4: Open the Web Application

Open your browser (Chrome/Edge) and navigate to:
👉 **`http://localhost:4200`**

---

## 🎯 STEP 5: Live UI Walkthrough & Expected Behavior

Here is each action you should demonstrate to the interviewer, along with what will visually happen on screen:

---

### Action 1: View Overview Dashboard (`/dashboard`)
- **What you do:** The app opens directly to the Dashboard.
- **Visual Output:**
  - Top hero banner: *"Welcome to EquiCare OPD System"*.
  - 4 Key Metric Cards:
    - **Total Registered:** `4`
    - **Today's Appointments:** `3`
    - **Pending Queue:** `2`
    - **Consultations Done:** `1`
  - Table: *"Today's OPD Queue"* showing today's patients with time, doctor name, and color-coded status badges (`BOOKED` in cyan, `COMPLETED` in emerald).

---

### Action 2: Patient Registration (`/patients`)
- **What you do:**
  1. Click **"Patients"** in the top navbar.
  2. Click the blue **"+ Register New Patient"** button.
  3. Enter details in the modal:
     - **Full Name:** `Karan Joshi`
     - **Gender:** `Male`
     - **Age:** `29`
     - **Phone Number:** `9876501234`
  4. Click **"Register Patient"**.
- **Visual & System Output:**
  - A green floating toast banner appears top-right: *"Patient 'Karan Joshi' registered successfully! (ID: #PID-5)"*.
  - Modal automatically closes.
  - The patient table instantly refreshes to show `Karan Joshi` as `#PID-5`.

---

### Action 3: Real-Time Patient Search (`/patients`)
- **What you do:**
  1. In the search box, type `Karan` or `9876`.
- **Visual & System Output:**
  - The table filters immediately without reloading the page.
  - Result pill updates: *"1 Patient Found"*.
  - Clearing the search box instantly restores all patients.

---

### Action 4: Book an Appointment (`/appointments`)
- **What you do:**
  1. Click the green **"Book"** button on `Karan Joshi`'s row in Patients screen (or click **"Appointments"** in navbar ➔ **"+ Book New Appointment"**).
  2. In the modal:
     - Patient is already auto-selected: `Karan Joshi`.
     - **Doctor:** `Dr. Anita Desai (General Physician)`.
     - **Date:** Today's date (auto-selected).
     - **Time:** `11:30`.
  3. Click **"Confirm Appointment"**.
- **Visual & System Output:**
  - A green toast appears: *"Appointment booked with Dr. Anita Desai on 2026-10-07!"*.
  - Under the **"Today's Queue"** tab, `Karan Joshi` appears in the schedule with a blue `BOOKED` badge and a blue **"Start Consultation"** button.

---

### Action 5: Doctor Consultation Room (`/consultations`)
- **What you do:**
  1. Click the blue **"Start Consultation"** button next to `Karan Joshi` (or click **"Consultations"** in the top navbar and click `Karan Joshi` from the left appointment queue).
  2. The right panel opens the Consultation Workspace showing patient summary: `Karan Joshi`, Age: `29`, Doctor: `Dr. Anita Desai`.
  3. Fill in the Vitals:
     - **Blood Pressure (mmHg):** `118/78 mmHg`
     - **Body Temperature (°F):** `98.4`
  4. Fill in **Clinical Notes & Prescription**:
     - *`"Patient presented with mild sore throat and cough for 2 days. Chest clear. Prescribed Azithromycin 500mg once daily for 3 days and warm saline gargles. Follow up if symptoms persist."`*
  5. Click the green **"Complete & Close Consultation"** button.
- **Visual & System Output:**
  - A green toast notification appears: *"Consultation marked as COMPLETED! Appointment closed."*.
  - A green alert banner appears on top of the form: *"Consultation Completed & Closed"*.
  - The appointment status in the left queue switches to a green `COMPLETED` badge.

---

### Action 6: View Patient Consultation History (`/consultations`)
- **What you do:**
  1. Click the tab: **"Patient Consultation Records"**.
  2. In the dropdown, select `Karan Joshi`.
- **Visual & System Output:**
  - An interactive timeline card appears showing:
    - Doctor: `Dr. Anita Desai`
    - Date & Time: Today's date
    - Vitals Pills: `BP: 118/78 mmHg` | `Temp: 98.4 °F`
    - Doctor's Notes: The prescription and advice entered in Step 5.

---

## 🛑 How to Stop the Servers When Finished

1. In the Spring Boot terminal: Press `Ctrl + C` ➔ Type `Y` to terminate.
2. In the Angular terminal: Press `Ctrl + C` ➔ Type `Y` to terminate.
3. In XAMPP: Click **Stop** next to MySQL.
