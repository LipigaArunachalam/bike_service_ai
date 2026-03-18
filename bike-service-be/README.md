# RevUp Bike Service Backend

A scalable, production-ready backend for a Bike Service Web Application built with Node.js, Express, and MongoDB.

## Features

- **Modular Architecture**: Clean separation of concerns (Controllers, Services, Routes, Models).
- **Authentication**: JWT-based authentication with bcrypt password hashing.
- **RBAC**: Role-Based Access Control (Admin and User roles).
- **Booking Management**: Complete flow for creating and managing service bookings.
- **Notifications**: Automated email notifications via Nodemailer on service completion.
- **Error Handling**: Global error handling middleware with custom `ApiError` utility.

## Prerequisites

- Node.js (v14+)
- MongoDB (Running locally or on Atlas)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Create a `.env` file in the root directory (using the template below):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bike-service
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=90d
   
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your_user
   EMAIL_PASS=your_pass
   EMAIL_FROM=noreply@revup.com
   ```

3. **Seed the database**:
   This will create an admin user and some default services.
   ```bash
   npm run seed
   ```

4. **Run the application**:
   ```bash
   npm start
   ```
   For development:
   ```bash
   npm run dev
   ```

## API Modules

- `auth`: Registration and Login.
- `user`: User profile and role management.
- `service`: CRUD for bike service types (Admin only for modifications).
- `booking`: User booking management.
- `admin`: Admin-specific booking status updates and deletions.
- `notification`: Integrated email service.
