# CyberProof Backend

This is the Node.js / Express backend for CyberProof. It uses Prisma ORM with an SQLite database for simple local deployment and persistence.

## Prerequisites

- Node.js (v18 or newer recommended)
- npm

## Setup Instructions

1. **Install Dependencies**
   Navigate to the `server` directory and install the packages:
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `server` directory based on the `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *The default configuration uses a local SQLite database (`dev.db`) and runs on port `4000`.*

3. **Database Initialization**
   Apply the Prisma schema to create the database tables:
   ```bash
   npx prisma db push
   ```

4. **Seed Mock Data (Optional but Recommended)**
   The backend comes with an endpoint to seed educational data (Learn Hub articles, Threat Pulse updates). You can seed this by running the server and sending a POST request to:
   ```
   POST http://localhost:4000/api/data/reset
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The backend will start and listen for API requests on `http://localhost:4000`.

## Architecture Overview

- **`src/index.ts`**: Entry point and middleware setup.
- **`src/routes/`**: API routes for analysis, history, watchlist, content, and incidents.
- **`src/services/analysisEngine.ts`**: The core heuristic engine that processes URLs, emails, messages, and QR codes.
- **`prisma/schema.prisma`**: Database models for `Scan`, `WatchlistItem`, `Incident`, `LearnArticle`, and `ThreatPulse`.
