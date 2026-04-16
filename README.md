# Job Pilot - Employer Dashboard

A modern, full-stack web application designed for employers to seamlessly post and manage job listings. Built with a unified, scalable architecture, it features secure authentication, company profile management, and a robust job dashboard equipped with server-side pagination and modern UI interactions.

---

## 🚀 Tech Stack

### Frontend (`job-pilot-frontend`)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (with Redux Persist for local caching)
- **API Client**: Axios

### Backend (`job-pilot-backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **File Storage**: Cloudinary (memory buffer streams for company logos)

---

## 📦 Features
- **Secure Authentication**: Robust Signup and Login flows with JWT generation. The token is stored securely via Redux Persist on the client to maintain sessions.
- **Employer Profile**: Employers can configure their company profiles including uploading custom logos directly to Cloudinary.
- **Job Flow Pipeline**:
  - **Create**: Detailed post-job forms with comprehensive validations.
  - **Read**: Interactive `/my-jobs` dashboard featuring server-side pagination and a detailed Job View pane.
  - **Update**: Edit existing job records to tweak requirements, salaries, or expiration dates.
  - **Delete**: Soft/Hard delete jobs through a standardized warning modal.
- **Automated Mechanics**: Jobs automatically detect their expiration date based on `createdAt` vs the set target date, shifting their status dynamically from **Active** to **Expired**.
- **Account Control**: End-to-end account deletion that wipes the user metadata and cascades to purge all jobs previously posted by that employer.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or hosted via MongoDB Atlas)
- Cloudinary Account (for hosting image uploads securely)

### 1. Clone & Install
```bash
# Clone the repository
git clone <repository-url>
cd job_pilot

# Install backend dependencies
cd job-pilot-backend
npm install

# Install frontend dependencies
cd ../job-pilot-frontend
npm install --legacy-peer-deps
```

### 2. Environment Variables
You must configure the `.env` files for both the frontend and backend to launch successfully.

**Backend** (`job-pilot-backend/.env`)
```env
PORT=5505
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend** (`job-pilot-frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5505
```

### 3. Run the Development Servers
Open two terminal instances:
```bash
# Terminal 1 - Boot Backend
cd job-pilot-backend
npm run dev

# Terminal 2 - Boot Frontend
cd job-pilot-frontend
npm run dev
```

The app will become available at `http://localhost:3000`.

---

## 📡 API Reference

Base URL (Local Environment): `http://localhost:5505`

> **Note:** All protected routes require a valid JWT token passed via the Authorization header using the format `Bearer <token>`.

### Authentication Endpoints (`/api/auth`)
| HTTP Method | Endpoint | Description | Auth Required | Request Body |
|---|---|---|---|---|
| `POST` | `/signup` | Registers a new employer account | No | `fullName`, `username`, `email`, `password` |
| `POST` | `/login` | Authenticates an employer & issues JWT | No | `email`, `password` |

### Employer / Profile Endpoints (`/api/user`)
| HTTP Method | Endpoint | Description | Auth Required | Request Format |
|---|---|---|---|---|
| `PATCH` | `/update-company` | Update company details and/or upload a new logo | Yes | `multipart/form-data` (logo file + strings) |
| `DELETE` | `/delete-account` | Deletes user account AND cascade purges all their jobs | Yes | None |

### Jobs Endpoints (`/api/jobs`)
| HTTP Method | Endpoint | Description | Auth Required | Request Query / Body |
|---|---|---|---|---|
| `GET` | `/` | Retrieves matching jobs for the active employer | Yes | **Query**: `?page=1&limit=10` |
| `GET` | `/:id` | Recovers the data object of a specific job | Yes | None |
| `POST` | `/` | Commits a new job listing to the DB | Yes | Title, Salary boundaries, Location, Tags, etc. |
| `PUT` | `/:id` | Patches an existing job object | Yes | Updated job fields |
| `DELETE` | `/:id` | Purges a specific job from the database | Yes | None |

---

## 📁 System Architecture

```text
job_pilot/
├── job-pilot-backend/
│   ├── src/
│   │   ├── config/             # Database connection setups
│   │   ├── controllers/        # Request handling (Auth, Users, Jobs)
│   │   ├── middlewares/        # Security wrappers (verifyToken)
│   │   ├── models/             # Mongoose schemas definition
│   │   ├── routes/             # Express.js endpoint routing
│   │   └── utils/              # Third-party helpers (Cloudinary buffer streams)
│   └── app.js                  # Backend Entrypoint
│
└── job-pilot-frontend/
    ├── app/                    # Next.js 14 App Router integration
    │   ├── (dashboard)/        # Layout wrap for authenticated routing (Jobs, Settings)
    │   ├── login/              # Auth flow
    │   └── signup/             # Auth flow
    ├── components/             # Reusable UI fragments (Modals, Tables, Forms, Sidebars)
    ├── lib/                    # Core configuration (Redux Store slices, Global Axios object)
    └── public/                 # Static graphical assets & iconography
```
