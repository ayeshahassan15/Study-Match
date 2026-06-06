# Study Match

A full-stack web application that helps students find study buddies based on shared subjects, available days, and time slots.

## Features
- User authentication (signup, login, logout)
- Register as a study buddy with subjects, days, and time slot
- View all registered students
- View student details
- Edit and update student profiles
- Delete student profiles
- Search and filter students by subject, day, and time slot
- Protected routes for authenticated users
- Responsive design
- Form validation on all forms

## Technologies Used
- Frontend: React JS, React Router, Axios, Vite
- Backend: Node.js, Express JS (Serverless via Vercel)
- Database: MongoDB with Mongoose
- Authentication: JWT
- Deployment: Vercel

## Live Demo
https://study-match-r7c2.vercel.app

## Setup Instructions

### Frontend
cd client
npm install
npm run dev

### Backend
cd server
npm install
npm run dev

### Environment Variables
Create a .env file inside server/ folder:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studymatch
JWT_SECRET=your_jwt_secret_key
PORT=5000

## API Endpoints
POST   /api/auth/register     - Register user
POST   /api/auth/login        - Login user
GET    /api/students          - Get all students
GET    /api/students?id=:id   - Get student by ID
POST   /api/students          - Create student
PUT    /api/students?id=:id   - Full update
PATCH  /api/students?id=:id   - Partial update
DELETE /api/students?id=:id   - Delete student