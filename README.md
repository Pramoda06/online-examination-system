# Online Quiz / Examination System

A MERN-based online examination platform where instructors create quizzes and students attempt timed tests with automatic grading, result breakdowns, domain-based quiz browsing, and leaderboards.

## Features

- JWT authentication for secure login and protected routes
- Role-based access for instructors and students
- Instructor question bank
- Quiz builder with:
  - MCQ tests
  - Multiple-answer tests
  - Written exams
  - Assessment tests
  - Domain and subdomain selection
  - Custom domain support
  - Select-all questions option
- Student dashboard with domain and subdomain browsing
- Real sample quizzes seeded for each domain/subdomain
- Countdown timer with auto-submit
- Auto-grading for MCQ and multiple-answer questions
- Written/assessment answers marked for instructor review
- Result page with question-wise breakdown
- Domain leaderboard with student rankings
- Instructor analytics for quiz performance

## Tech Stack

**Frontend**

- React.js
- Vite
- CSS

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
online_quiz_application/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── attemptcontroller.js
│   │   ├── authcontroller.js
│   │   ├── questioncontroller.js
│   │   └── quizcontroller.js
│   ├── middleware/
│   │   ├── authmiddleware.js
│   │   └── rolemiddleware.js
│   ├── models/
│   │   ├── attempt.js
│   │   ├── question.js
│   │   ├── quiz.js
│   │   └── user.js
│   ├── routes/
│   │   ├── attemptroutes.js
│   │   ├── authroutes.js
│   │   ├── questionroutes.js
│   │   └── quizroutes.js
│   ├── utils/
│   │   ├── generatetoken.js
│   │   └── seedSampleQuizzes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   └── my-react/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── utils/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── index.css
│       │   └── main.jsx
│       ├── .env
│       └── package.json
└── README.md
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB Community Server or MongoDB Atlas
- MongoDB Compass, optional but useful for viewing data

## Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/online_quiz_application
JWT_SECRET=replace_this_with_a_long_secret_key
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `frontend/my-react/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real `.env` files containing production secrets.

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/your-username/online_quiz_application.git
cd online_quiz_application
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend/my-react
npm install
```

## Running the Project

Start MongoDB locally first if you are using local MongoDB.

Run the backend in one terminal:

```bash
cd backend
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Run the frontend in another terminal:

```bash
cd frontend/my-react
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Open this URL in your browser:

```text
http://localhost:5173
```

If PowerShell blocks npm scripts, use:

```bash
npm.cmd run dev
```

## Sample Quizzes

When the backend starts, it automatically seeds sample quizzes into MongoDB if they do not already exist.

Sample quiz domains include:

- CSE and IT
  - Cloud Computing
  - Full Stack
  - Cyber Security
  - Data Structures
- AI and Gen AI
  - Machine Learning
  - Deep Learning
  - Generative AI
  - Prompt Engineering
- Business and Aptitude
  - Logical Reasoning
  - Quantitative Aptitude
  - Communication
  - Case Study

Each sample quiz contains 5 questions and can be attempted by students. Scores are reflected in results and leaderboard.

## Main API Routes

### Auth

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Questions

```text
GET    /api/questions
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### Quizzes

```text
GET  /api/quizzes
POST /api/quizzes
PUT  /api/quizzes/:id
GET  /api/quizzes/published
GET  /api/quizzes/domains
GET  /api/quizzes/attempt/:id
GET  /api/quizzes/:id/analytics
```

### Attempts

```text
GET  /api/attempts/mine
GET  /api/attempts/leaderboard
GET  /api/attempts/:id
POST /api/attempts/:quizId/submit
```

## User Roles

### Instructor

Instructors can:

- Create questions
- Create quizzes
- Select quiz type
- Select domain/subdomain
- Create custom domains
- Publish quizzes
- View analytics

### Student

Students can:

- Browse domains and subdomains
- Attempt published quizzes once
- View auto-graded results
- View question-wise feedback
- View leaderboard rankings

## MongoDB Collections

The application uses these collections:

```text
users
questions
quizzes
attempts
```

You can view them in MongoDB Compass using:

```text
mongodb://127.0.0.1:27017
```

Database name:

```text
online_quiz_application
```

## Build and Verification

Frontend build:

```bash
cd frontend/my-react
npm run build
```

Frontend lint:

```bash
cd frontend/my-react
npm run lint
```

Backend syntax check:

```bash
cd backend
node --check server.js
```

## Deployment Notes

For deployment, use:

- MongoDB Atlas for database
- Render, Railway, or similar for backend
- Vercel or Netlify for frontend

Set backend environment variables on your backend host:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_secret
CLIENT_URL=https://your-frontend-url.com
```

Set frontend environment variable on your frontend host:

```env
VITE_API_URL=https://your-backend-url.com/api
```

## Author

Developed as a MERN online quiz and examination system project.
