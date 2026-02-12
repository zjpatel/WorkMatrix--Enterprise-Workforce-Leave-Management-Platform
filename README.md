# 🚀 WorkSphere – Enterprise Workforce & Leave Management Platform

WorkSphere is a full-stack enterprise-grade workforce management system built using Spring Boot, PostgreSQL, JWT Security, and Angular.  
It provides secure employee lifecycle management, approval-based authentication workflow, role-based authorization, holiday management, and advanced leave management with business rule enforcement.

---

## 🏢 Project Overview

WorkSphere is designed to simulate a real-world HRMS (Human Resource Management System) with:

- Secure authentication & authorization
- Employee & department management
- Image upload & management
- Holiday management module
- Leave management system with approval workflow
- Modular frontend architecture
- Role-based access control (Admin / Employee)

---

## 🛠 Tech Stack

### Backend
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Spring Security
- JWT Authentication
- BCrypt Password Encoder
- JpaSpecificationExecutor (Dynamic Filtering)

### Frontend
- Angular
- TypeScript
- RxJS
- Angular Router
- Guards & Interceptors
- Modular Architecture

### Tools
- Postman (API Testing)
- Git & GitHub

---

## 🔐 Security Features

- JWT-based Stateless Authentication
- Role-Based Authorization
- Approval-Based User Registration Flow
- Protected Routes (Frontend Guards)
- Secure Password Encryption (BCrypt)
- Token Expiry Handling & Auto-Redirect

---

## 👥 User Roles

### Admin
- Approve / Reject user registrations
- Create, update, delete employees
- Manage departments
- Manage holidays
- Approve / Reject / Revoke leaves
- View complete system data

### Employee
- View profile
- Upload profile images
- Apply for leave
- Edit/Delete leave (before approval)
- View holiday calendar
- Track leave usage

---

## 📦 Core Modules

### 1️⃣ Authentication Module
- Self-registration (PENDING status)
- Admin approval system
- JWT token generation
- Login restrictions for unapproved users

### 2️⃣ Employee Management
- CRUD operations
- Multi-image upload
- Department mapping
- Pagination & search
- Cascade-safe deletion

### 3️⃣ Holiday Management
- Admin-controlled holiday creation
- Month & year filtering
- Calendar & card view
- Role-based access

### 4️⃣ Leave Management
- Paid & unpaid leave tracking
- Leave approval workflow
- Revocation logic
- Business rule enforcement
- Yearly leave limits
- Real-time UI updates

---

## 🗂 Project Structure

### Backend
controller/
service/
repository/
entity/
security/
exception/


### Frontend
auth/
admin/
employee/
core/
shared/
guards/
interceptors/
services/



---

## 🔄 Application Flow

1. User registers → Status: PENDING
2. Admin approves user
3. User logs in → Receives JWT token
4. Protected routes enabled
5. Role-based access enforced at both frontend & backend

---

## 🧠 Key Highlights

- Complete employee lifecycle handling
- Approval-based authentication workflow
- Robust leave approval & revocation logic
- Secure image storage (BYTEA & local)
- Fully modular Angular architecture
- Production-style exception handling
- Clean separation of concerns

---

## 🚀 Future Improvements

- Dockerization
- Deployment on AWS
- Email notification system
- Audit logging
- Dashboard analytics
- Microservices architecture migration

---

## 👨‍💻 Author

Developed by Zeel  
BTech (CSE-AIML)

---

## ⭐ Why This Project Matters

This project demonstrates:

- Enterprise-level backend architecture
- Secure API design
- JWT-based authentication flow
- Advanced database relationship management
- Business rule enforcement
- Modular frontend architecture
- Real-world HR workflow simulation

