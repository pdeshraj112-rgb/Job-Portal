# Job Portal (MERN)

A full-stack job portal: seekers browse/apply to jobs, employers post jobs and manage applicants, admins moderate the platform.

## Stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Multer (resume uploads), Nodemailer
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios

## 1. Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free MongoDB Atlas cluster)

## 2. Configure environment
A single `.env` file at the project root is used by the backend (and its `VITE_API_URL` value is read by the frontend build). Edit `job-portal/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/job-portal   # or your Atlas connection string
JWT_SECRET=replace_with_a_long_random_string
```

Leave SMTP_* blank to run in dev mode — emails are logged to the backend console instead of actually being sent.

## 3. Install & run the backend
```bash
cd backend
npm install
npm run seed   # optional: creates an admin (admin@jobportal.com / Admin@123) + sample categories
npm run dev    # starts on http://localhost:5000
```

## 4. Install & run the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev    # starts on http://localhost:5173
```

Visit **http://localhost:5173**.

## 5. Typical flow to try it out
1. Register as an **employer** → fill in your Company profile on the Employer Dashboard → Post a Job.
2. Register as a **seeker** (separate email, or use a private/incognito window) → fill in your profile, upload a resume → browse Jobs → Apply.
3. Log back in as the employer → Employer Dashboard → Applicants → change an applicant's status.
4. Run `npm run seed` in backend and log in as `admin@jobportal.com` / `Admin@123` to moderate users/jobs/categories from `/admin`.

## Project structure
See the folder tree — it mirrors the roadmap: `backend/{config,models,routes,controllers,middleware,utils}` and `frontend/src/{components,pages,context,hooks,services}`.

## Notes / production hardening (not included, by design, to keep this runnable as a learning project)
- Add rate limiting & helmet for production.
- Swap local disk resume storage for S3/Cloud storage if deploying to an ephemeral host (e.g. Heroku, Vercel serverless).
- Add refresh tokens / token blacklist if you need instant logout revocation.
