# 🚗 Vehicle Rental System API

🔗 **Live URL:** https://next-level-assingment-2.vercel.app

A backend REST API for managing a **Vehicle Rental System**.  
The system allows users to register, browse available vehicles, create bookings, and manage rentals with secure **role-based authentication**.

---

# 📌 Project Overview

The **Vehicle Rental System API** is designed to handle the core operations of a rental service.  
It provides functionality for managing vehicles, users, and bookings with secure authentication and role-based access.

The system supports two roles:

- **Admin** – Full system control
- **Customer** – Can browse vehicles and create bookings

The API ensures secure data handling, booking validation, and automated vehicle availability management.

---

# ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- Secure password hashing using **bcrypt**
- JWT-based authentication
- Role-based access control (Admin & Customer)

### 🚗 Vehicle Management
- Add new vehicles
- View all vehicles
- View vehicle details
- Update vehicle information
- Delete vehicles (only if no active booking exists)

### 👤 User Management
- Admin can view all users
- Users can update their own profiles
- Admin can update or delete any user

### 📅 Booking System
- Create vehicle booking
- Validate vehicle availability
- Automatic total price calculation
- Cancel bookings
- Mark vehicles as returned
- Automatically update vehicle availability

---

# 🛠️ Technology Stack

| Technology | Description |
|------------|-------------|
| **Node.js** | JavaScript runtime |
| **TypeScript** | Type-safe development |
| **Express.js** | Backend web framework |
| **PostgreSQL** | Relational database |
| **bcrypt** | Password hashing |
| **jsonwebtoken (JWT)** | Authentication & authorization |

---
# ⚙️ Setup Instructions

## ⚙️ Setup & Usage Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/mahbubhossen/Next-Level-Assingment-2.git  
cd vehicle-rental-system

### 2️⃣ Install Dependencies

npm install

### 3️⃣ Create Environment Variables

Create a `.env` file in the root directory and add:

PORT=5000  
DATABASE_URL=your_postgresql_database_url  
JWT_SECRET=your_secret_key  

### 4️⃣ Run the Development Server

npm run dev

Server will start at:

http://localhost:5000

---

## 📦 Usage

Register a User  
POST /api/v1/auth/signup

Login  
POST /api/v1/auth/signin

Create Booking  
POST /api/v1/bookings

View Vehicles  
GET /api/v1/vehicles