# LoanPathfinder

**Tagline:** Explainable AI-powered loan assessment for transparent borrowing decisions.

LoanPathfinder is a MERN + Python ML full-stack project designed as a final-year capstone. It helps users understand *why* they are loan-ready (or not), what changes can improve outcomes, and which loan offers best match their goals.

## Core Modules

1. **Loan Readiness Score (LRS) with explainability**
   - Predicts LRS, APR, and approval probability using trained ML models.
   - Returns feature-level contribution insights (XAI-style additive breakdown).

2. **What-If Simulator**
   - Simulates the impact of profile changes (income, debt, savings, etc.) in real-time.
   - Compares before/after APR, LRS, and approval probability.

3. **Commission-Neutral Marketplace**
   - Ranks loan offers by user objective:
     - Lowest total interest
     - Lowest monthly payment
     - Fastest funding
   - Ignores lender commission in ranking logic.

---

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **ML Service:** Python + Flask + scikit-learn
- **Database:** MongoDB (user accounts, profiles, assessment history, offers)

---

## Project Structure

```bash
.
├── client/        # React UI
├── server/        # Express API
├── ml-service/    # Python training + inference service
├── artifacts/     # Saved trained model artifacts
└── README.md
```

---

## Setup & Run

### 1) Environment

Copy env values:

```bash
cp .env.example .env
```

Then set your Atlas URI in `.env` (the current workspace is already configured with your provided connection string):

```env
MONGO_URI="mongodb+srv://..."
```

### 2) Install dependencies

```bash
npm --prefix client install
npm --prefix server install
python3 -m venv .venv
source .venv/bin/activate
pip install -r ml-service/requirements.txt
```

### 3) Train the ML models

```bash
python ml-service/train_model.py
```

Model artifacts are saved in `artifacts/`.

### 4) Seed sample loan offers

```bash
export $(cat .env | xargs)
npm --prefix server run seed
```

### 5) Start services

**Terminal A**
```bash
source .venv/bin/activate
python ml-service/app.py
```

**Terminal B**
```bash
export $(cat .env | xargs)
npm --prefix server run dev
```

**Terminal C**
```bash
export $(cat .env | xargs)
npm --prefix client run dev
```

Open: `http://localhost:5173`

---

## API Snapshot

- `POST /api/auth/register`
- `POST /api/auth/login`
- `PUT /api/profile`
- `GET /api/profile`
- `POST /api/assessment/run`
- `POST /api/assessment/simulate`
- `GET /api/assessment/marketplace`
- `GET /api/assessment/history`

---

## Notes for Demonstration

- Uses synthetic training data by default (privacy-safe for prototype).
- Model quality metrics are exported to `artifacts/metrics.json`.
- Designed to be easily extensible with real bureau/Open Banking data in production.
