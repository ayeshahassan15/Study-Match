# Study Match

A full-stack web application that helps university students find study buddies based on shared subjects, available days, and time slots.

## Live Demo
https://study-match-r7c2.vercel.app

## Project Description
Study Match solves the problem of students struggling to find compatible study partners. Students can register their profile with their subjects, availability, and preferred time slots. They can then search and match with other students, send connection requests, join study groups, and rate their study buddies.

## Features
- User authentication (signup, login, logout) with JWT
- Register a student profile with subjects, days, and time slot
- View all registered students with search, sort, and pagination
- View student details
- Edit and update student profiles (PUT and PATCH)
- Delete student profiles
- Find Match page with match percentage scoring
- Connection requests (send, accept, reject)
- Notifications system
- Study groups (create, join, leave, edit, delete)
- Student rating system (1-5 stars)
- Badges system (New Member, Connected, Top Rated)
- User profile page with badges and ratings
- Edit account (name and password)
- Dark/Light mode toggle
- Protected routes for authenticated users
- Responsive design with hamburger menu
- Form validation on all forms
- Toast notifications
- Landing page for non-logged-in users

## Technologies Used
- **Frontend:** React JS, React Router, Axios, Vite, Context API
- **Backend:** Node.js, Express JS (Serverless Functions via Vercel)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:** Vercel

## Project Structure
study-match/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # AuthContext, ToastContext, ThemeContext
│   │   ├── hooks/           # Custom hooks (useForm, usePageTitle, useKeyboard)
│   │   └── pages/           # All page components
├── server/                  # Backend logic
│   ├── api/                 # Express route handlers
│   ├── controller/          # Controller functions
│   ├── models/              # Mongoose models
│   └── routes/              # Route definitions
├── api/                     # Vercel serverless functions
└── vercel.json              # Vercel configuration


## Setup Instructions
### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Database Setup
1. Create a free MongoDB Atlas account at https://mongodb.com
2. Create a new cluster
3. Get your connection string
4. Add it to your .env file

### Environment Variables
Create a `.env` file inside the `server/` folder:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/studymatch?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
PORT=5000


### Run Locally
1. Clone the repository
```bash
git clone <your-repo-url>
cd study-match
```
2. Setup frontend
```bash
cd client
npm install
npm run dev
```
3. Setup backend
```bash
cd server
npm install
npm run dev
```
4. Open http://localhost:5173 in your browser

## API Endpoints
### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| PATCH | /api/auth/update | Update account |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students?id=:id | Get student by ID |
| POST | /api/students | Create student profile |
| PUT | /api/students?id=:id | Full update student |
| PATCH | /api/students?id=:id | Partial update student |
| DELETE | /api/students?id=:id | Delete student |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/groups | Get all groups |
| POST | /api/groups | Create group |
| PUT | /api/groups?id=:id | Update group |
| PATCH | /api/groups?id=:id | Join group |
| DELETE | /api/groups?id=:id | Leave/delete group |

### Connections
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/connections | Get connections and notifications |
| POST | /api/connections/send | Send connection request |
| PATCH | /api/connections/accept | Accept connection |
| PATCH | /api/connections/reject | Reject connection |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/ratings?userId=:id | Get user rating |
| POST | /api/ratings | Submit rating |