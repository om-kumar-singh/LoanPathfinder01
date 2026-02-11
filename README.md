# LoanPathfinder

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application that helps users understand their loan readiness, simulate financial scenarios, and compare loan offers from a commission-neutral marketplace.

---

## Features

- **Authentication** — JWT-based login and registration with protected routes
- **Loan Readiness Score (LRS)** — Score (0–100) and estimated APR from income, credit score, debt, and savings
- **What-If Simulator** — See how hypothetical changes (income, debt, savings, credit score) affect your score and APR
- **Loan Marketplace** — Compare loan products ranked by your goal: lowest interest, lowest monthly payment, or fastest funding
- **Responsive UI** — React + Vite frontend with React Router and Auth Context

---

## Tech Stack

| Layer    | Stack                          |
| -------- | ------------------------------ |
| Frontend | React 18, Vite, React Router 6, Axios |
| Backend  | Node.js, Express               |
| Database | MongoDB (Mongoose)             |
| Auth     | JWT, bcryptjs                  |

---

## Project Structure

```
loanpathfinder/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # Login, Register, Dashboard, LoanScore, Simulator, Marketplace
│   │   ├── services/      # api.js (Axios + JWT)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                 # Node + Express backend
│   ├── config/            # db.js (MongoDB)
│   ├── controllers/       # auth, loan, simulator, marketplace
│   ├── middleware/        # auth, error handling
│   ├── models/            # User, LoanScore, LoanProduct
│   ├── routes/            # auth, health, loan, simulator, marketplace
│   ├── utils/             # generateToken, seedLoanProducts
│   ├── __tests__/         # Jest tests
│   ├── app.js
│   └── server.js
├── package.json           # Root scripts (optional)
└── README.md
```

---

## Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd loanpathfinder
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder (copy from `.env.example`):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_min_32_chars
```

**Seed loan products** (required for the Marketplace):

```bash
npm run seed
```

### 3. Frontend setup

```bash
cd ../client
npm install
```

Optional: create `.env` in `client` if the API is not on `localhost:5000`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Project

### Development

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

Server runs at **http://localhost:5000**

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Client runs at **http://localhost:3000**

### Production

```bash
# Backend
cd server && npm start

# Frontend (build)
cd client && npm run build && npm run preview
```

### Root scripts (optional)

From the project root, if you have a root `package.json`:

```bash
npm run server    # starts backend (server folder)
npm run client    # starts frontend (client folder)
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/profile` | Yes | Current user profile |
| POST | `/api/loan/calculate` | Yes | Loan Readiness Score + APR + breakdown |
| POST | `/api/simulator/run` | Yes | What-if simulation (score & APR) |
| POST | `/api/marketplace/rank` | Yes | Ranked loan offers by goal |

Protected routes use header: `Authorization: Bearer <token>`.

---

## Testing

Backend tests (Jest + Supertest):

```bash
cd server
npm test
```

---

## Environment Variables

| Variable | Where | Description |
|----------|--------|-------------|
| `NODE_ENV` | server | `development` or `production` |
| `PORT` | server | Server port (default 5000) |
| `MONGO_URI` | server | MongoDB connection string |
| `JWT_SECRET` | server | Secret for signing JWTs |
| `VITE_API_URL` | client | API base URL (default `http://localhost:5000/api`) |

---

## License

ISC (or your preferred license).

---

## Author

LoanPathfinder — MERN stack academic / capstone project.
