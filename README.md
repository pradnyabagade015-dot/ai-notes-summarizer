# AI Notes Summarizer

AI Notes Summarizer turns study material into useful learning resources. Upload or write notes, generate concise AI summaries, create flashcards and multiple-choice questions, and organize revision with a study plan.

## Live demo

[Open the production app](https://ai-notes-summarizer-app-one.vercel.app)

## Features

- Secure account registration, login, password reset, and JWT-protected routes
- Note upload and management for text, PDF, and DOCX files
- AI-powered summaries, flashcards, MCQs, content generation, and note chat
- Study plans and an AI usage dashboard
- Premium subscription payments through Razorpay
- Responsive React interface with a Vercel serverless Express API

## Tech stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Express, Mongoose, JWT, Multer
- **AI:** Google Gemini with Groq fallback
- **Data and services:** MongoDB Atlas, Razorpay, Nodemailer
- **Deployment:** Vercel static hosting and Node.js serverless functions

## Local installation

### Prerequisites

- Node.js 20 or later
- A MongoDB Atlas database
- Gemini or Groq API credentials

### Setup

1. Clone the repository and install the frontend dependencies:

   ```bash
   npm install
   ```

2. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   cd ..
   ```

3. Create local environment files from the included templates:

   ```bash
   copy .env.example .env
   copy backend\\.env.example backend\\.env
   ```

   On macOS or Linux, use `cp` instead of `copy`.

4. Set the required values in `backend/.env`, then start the services in separate terminals:

   ```bash
   npm run dev
   ```

   ```bash
   cd backend
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and the local API runs at `http://localhost:5000`.

## Environment variables

Never commit real credentials. `.env` files are ignored by Git; use the example files as the source of truth.

| File | Variables |
| --- | --- |
| `.env` | `VITE_API_URL` (optional for local API), `VITE_SITE_URL` (optional) |
| `backend/.env` | `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `GROQ_MODEL`, `CLIENT_URL` |
| `backend/.env` | `PAYMENT_GATEWAY_ENABLED`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_PREMIUM_AMOUNT_PAISE`, `RAZORPAY_CURRENCY` |
| `backend/.env` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` |

See [`.env.example`](.env.example) and [`backend/.env.example`](backend/.env.example) for placeholders and defaults.

## Production deployment

The project deploys as one Vercel application:

- Vite builds the frontend into `dist`.
- `api/[...path].js` exposes the Express application as a catch-all serverless API.
- `vercel.json` routes `/api/*` to the function before applying the React SPA fallback.

Configure the backend environment variables in the Vercel project settings. Set `CLIENT_URL` to the deployed frontend URL and use production MongoDB, AI, email, and Razorpay credentials. Do not expose secret values through `VITE_*` variables.

Before deployment, run:

```bash
npm run build
npm run lint
```

## Screenshots

_Add screenshots of the dashboard, note upload flow, generated summary, flashcards, and MCQ experience here before public launch._

## License

This project is private and not licensed for redistribution.
