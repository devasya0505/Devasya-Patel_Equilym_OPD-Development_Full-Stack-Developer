# 🏥 EquiCare OPD — Outpatient Department Mini-Module

A complete, demo-ready **Outpatient Department (OPD) Management System** built with **Spring Boot 4, Spring Data JPA, MySQL (MariaDB), and Angular 22**.

---

## 🌟 Architecture & Technology Stack

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Backend** | Spring Boot 4.0.0, Java 24 | RESTful APIs, Spring Web, Validation, Lombok |
| **ORM / Persistence** | Spring Data JPA / Hibernate | Auto-DDL schema migration (`update`), Derived Queries |
| **Database** | MySQL / MariaDB (XAMPP default) | Port 3306, `opd_db` |
| **Frontend** | Angular 22 (Standalone Components) | Reactive Forms, RxJS, Modern Glassmorphism CSS |
| **Icons & Typography** | FontAwesome 6, Google Fonts | Plus Jakarta Sans & Space Grotesk |

---

## 📋 Core Scope & Deliverables

### 1. Patient Registration & Search (Screen 1: `/patients`)
- ✅ **Register Patient**: Captures `name`, `gender` (MALE/FEMALE/OTHER), `age` (0-150), and `phone` (10-15 digits regex).
- ✅ **List Patients**: Modern responsive table with PID badges, gender pills, and registration date.
- ✅ **Real-Time Search**: Instant search bar querying by patient **Name** (case-insensitive) OR **Phone Number**.
- ✅ **Medical History**: Modal timeline showing all completed consultations and past visits for that patient.

### 2. Appointment Booking & OPD Queue (Screen 2: `/appointments`)
- ✅ **Book Appointment**: Selects registered patient from dropdown, selects doctor, picks date/time slot.
- ✅ **Today's OPD Queue**: Dedicated tab displaying today's patient queue sorted chronologically.
- ✅ **All Appointments View**: Complete overview of upcoming and historical bookings.
- ✅ **Status Lifecycle**: Tracks appointments through `BOOKED` ➔ `COMPLETED`.
- ✅ **Quick Action**: "Start Consultation" one-click button that navigates directly into the consultation room.

### 3. Doctor Consultation Summary (Screen 3: `/consultations`)
- ✅ **Vitals Recording**: Doctor enters Blood Pressure (e.g., `120/80 mmHg`) and Body Temperature in °F (e.g., `98.6`).
- ✅ **Clinical Notes**: Doctor enters diagnosis findings, prescribed medicines, and advice.
- ✅ **Mark Complete**: Atomic `@Transactional` operation that finalizes consultation and marks the appointment as `COMPLETED`.
- ✅ **Patient History Browser**: Second tab allows the doctor to pick any patient and view all past finalized consultations.

---

## 🚀 How to Run the Application

### Prerequisites
- Java 21 or Java 24 installed
- Node.js (v20+ or v24) and npm
- MySQL running on port 3306 (e.g., XAMPP MySQL) with database `opd_db`

### Step 1: Start MySQL Database
Ensure MySQL is running on `localhost:3306` with user `root` and password `Devpatel@2005`.
```sql
CREATE DATABASE IF NOT EXISTS opd_db;
```

### Step 2: Run the Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```
> The backend runs on **`http://localhost:8080`**. It automatically seeds realistic sample patients, appointments, and consultations on first startup via `DataInitializer`.

### Step 3: Run the Angular Frontend
```bash
cd frontend
npm install
npm start
```
> Open your browser at **`http://localhost:4200`**.

---

## 📡 REST API Documentation

### Patients Endpoints (`/api/patients`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/patients` | Register a new patient (with Bean Validation) |
| `GET` | `/api/patients` | Retrieve all registered patients |
| `GET` | `/api/patients/{id}` | Get patient details by ID |
| `GET` | `/api/patients/search?keyword=...` | Search patients by name or phone |

### Appointments Endpoints (`/api/appointments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/appointments?patientId={id}` | Book an appointment for a patient |
| `GET` | `/api/appointments` | List all appointments |
| `GET` | `/api/appointments/today` | List today's appointments queue (sorted by time) |
| `GET` | `/api/appointments/{id}` | Get appointment by ID |
| `GET` | `/api/appointments/patient/{patientId}` | Get all appointments for a patient |

### Consultations Endpoints (`/api/consultations`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/consultations?appointmentId={id}` | Create doctor consultation (vitals + notes) |
| `PUT` | `/api/consultations/{id}/complete` | Mark consultation complete and update appointment status |
| `GET` | `/api/consultations/patient/{patientId}` | Get all completed consultations for a patient |
| `GET` | `/api/consultations/appointment/{appointmentId}` | Get consultation details for an appointment |

---

## 💡 Code & Functional Flow Explanation (For Placement Interview)

### 1. Functional Workflow
1. **Receptionist**: Opens **Patients** screen ➔ Registers patient ➔ Clicks **Book** to schedule an appointment with a doctor for today.
2. **OPD Queue**: The appointment immediately appears in **Today's Queue** with `BOOKED` status.
3. **Doctor**: Opens **Consultations** screen ➔ Selects patient from today's queue ➔ Reviews previous history ➔ Enters vitals (Blood Pressure, Temperature) & Clinical Notes ➔ Clicks **Complete & Close**.
4. **Outcome**: The consultation is saved, the appointment status flips to `COMPLETED`, and the patient's medical timeline is permanently updated.

### 2. Backend Code Architecture
- **Controller Layer** (`com.opd.controller`): Handles HTTP routing, request deserialization, `@Valid` bean validation, and CORS.
- **Service Layer** (`com.opd.service`): Implements business logic (e.g. verifying patient existence, atomic `@Transactional` state changes).
- **Repository Layer** (`com.opd.repository`): Spring Data JPA derived query methods (e.g. `findByNameContainingIgnoreCaseOrPhoneContaining`).
- **Entity Layer** (`com.opd.entity`): JPA entities with `@ManyToOne` (Appointment ➔ Patient) and `@OneToOne` (Consultation ➔ Appointment) relationships.
- **Global Exception Handler** (`com.opd.exception`): Intercepts validation failures and runtime errors to return uniform, friendly JSON payloads.

---

## 🎨 UI Screens & Features
- **Dashboard (`/dashboard`)**: Live summary metrics (Total Patients, Today's Appointments, Pending Queue, Completed Consultations) and quick launcher.
- **Patient Directory (`/patients`)**: Modal registration form with live validations, real-time search filter, and medical history drawer.
- **Appointments (`/appointments`)**: Multi-tab schedule viewer ("Today's Queue" vs "All Appointments") and doctor booking modal.
- **Consultation Room (`/consultations`)**: Split-screen doctor workspace with real-time queue selector, vitals tracker, prescription pad, and historical records viewer.
