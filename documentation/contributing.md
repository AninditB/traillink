# Contributing Guide

## Development Workflow

1. Pull the latest code.
2. Install dependencies in the root project and `backend/`.
3. Create or update `backend/.env`.
4. Start the backend.
5. Start the Expo app.
6. Make focused changes.
7. Run linting and relevant tests before handing off.

## Commands

Frontend:

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
npm test
```

Backend:

```bash
cd backend
npm run dev
npm start
```

## Code Organization

Use Expo Router file-based routes for screens under `app/`.

Keep shared visual components in `components/`, shared hooks in `hooks/`, and app constants in `constants/`.

For backend work, add route definitions in `backend/routes/api.js`, controller logic in `backend/controllers/`, and persistent data structures in `backend/models/`.

## Backend Route Checklist

When adding a route:

- Define the route in `backend/routes/api.js`.
- Put business logic in a controller.
- Add `authMiddleware` if the route needs the logged-in user.
- Validate required request fields.
- Return consistent JSON errors.
- Update [API Reference](./api.md).

## Frontend API Checklist

When adding or changing API calls:

- Keep API base URLs consistent across screens.
- Use `withCredentials: true` for session-protected backend routes.
- Handle loading, success, empty, and error states.
- Confirm the backend route exists before wiring a screen to it.

## Environment and Secrets

Do not commit real `.env` values, MongoDB credentials, JWT secrets, or session secrets.

Use local `.env` files for development and platform-managed secrets for deployment.

## Testing Notes

Current test coverage is minimal. At a minimum, run:

```bash
npm run lint
```

For frontend component changes, run:

```bash
npm test
```

For backend route changes, manually test the changed route with a tool such as curl, Postman, or an API client.
