# Study Match

A full-stack web application that helps students find study partners based on shared subjects and availability.

Built with the MERN stack — MongoDB, Express, React, and Node.js.

---

## Features

- Register your profile with your name, subjects, available days, and preferred time slot
- Browse all registered students
- Search and filter to find students who match your schedule and subjects

---

## Tech Stack

**Frontend** — React, React Router, Axios, Vite  
**Backend** — Node.js, Express  
**Database** — MongoDB with Mongoose

---

## Getting Started

### Prerequisites

- Node.js installed
- A MongoDB Atlas account (free tier works fine)

### 1. Clone the repository

```bash
git clone https://github.com/ayeshahassan15/study-match.git
cd study-match
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will open at `http://localhost:5173`

---

## Folder Structure

```
study-match/
  client/        React frontend
  server/        Express backend
    models/      Mongoose schemas
    routes/      API routes
```

---

## Author

Ayesha Hassan — [GitHub](https://github.com/ayeshahassan15) · [LinkedIn](https://linkedin.com/in/ayesha-hassan)
