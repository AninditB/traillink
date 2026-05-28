# Setup Guide

## Prerequisites

- Node.js and npm
- Expo Go, Android Emulator, or iOS Simulator
- MongoDB connection string
- A reachable backend host address for the mobile app

## Install Dependencies

Install frontend dependencies from the repository root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Backend Environment

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=5000
```

`MONGO_URI` is required because the server connects to MongoDB at startup and also uses MongoDB-backed session storage.

## Configure API URLs

The mobile app currently uses hard-coded backend URLs such as:

```text
http://192.168.4.34:5000
http://192.168.4.34:5000/api
```

These appear in screens under `app/auth`, `app/main`, and `app/main/tabs`. Update them to match your environment:

- Physical device: use your computer's LAN IP address.
- Android Emulator: use `http://10.0.2.2:5000`.
- iOS Simulator: `http://localhost:5000` usually works.
- Expo web: `http://localhost:5000` usually works.

## Run the Backend

From `backend/`:

```bash
npm run dev
```

or:

```bash
npm start
```

The backend listens on:

```text
http://0.0.0.0:5000
```

The API routes are mounted under:

```text
http://localhost:5000/api
```

## Run the Expo App

From the repository root:

```bash
npm start
```

Then open the app with Expo Go, Android Emulator, iOS Simulator, or web.

Platform-specific scripts:

```bash
npm run android
npm run ios
npm run web
```

## Useful Checks

Run linting:

```bash
npm run lint
```

Run Jest in watch mode:

```bash
npm test
```

Check backend health:

```bash
curl http://localhost:5000/api/ping
```

Expected response:

```json
{ "message": "Pong!" }
```

## Common Issues

If the mobile app cannot reach the backend, confirm that the API URL points to a host reachable from the device running Expo.

If authenticated routes return `401`, confirm that login succeeded and that the session cookie is being preserved by the client request. Authenticated frontend requests currently use `withCredentials: true`.

If the backend fails on startup, confirm that `MONGO_URI` is present and valid.
