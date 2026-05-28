# Architecture

## Overview

TrailLink has two main parts:

- Expo React Native frontend in `app/`, `components/`, `hooks/`, and `constants/`
- Express and MongoDB backend in `backend/`

The frontend talks to backend routes under `/api`. Authentication uses login-created server sessions with a JWT stored in the session.

## Frontend Structure

```text
app/
|-- auth/            # Welcome, login, signup, and forgot password screens
|-- main/            # Dashboard, create post, and authenticated app layout
|-- main/tabs/       # Main tab screens: explore, navigate, chats, profile
|-- group/[id].tsx   # Dynamic group route
`-- _layout.tsx      # Root layout
```

Supporting folders:

```text
components/          # Shared UI components
constants/           # Shared constants such as colors
hooks/               # Shared React hooks
assets/              # Images, icons, and fonts
```

## Backend Structure

```text
backend/
|-- server.js          # Express app setup, middleware, sessions, route mounting
|-- config/db.js       # MongoDB connection
|-- routes/api.js      # API route definitions
|-- controllers/       # Route handlers
|-- middleware/auth.js # Session/JWT authentication middleware
`-- models/           # Mongoose models
```

## Authentication Flow

1. User signs up through `POST /api/signup`.
2. User logs in through `POST /api/login`.
3. Backend verifies credentials, creates a JWT, and stores it in `req.session.jwt`.
4. Authenticated routes use `authMiddleware`.
5. `authMiddleware` reads `req.session.jwt`, verifies it with `JWT_SECRET`, and assigns the decoded user to `req.user`.
6. Logout destroys the session through `POST /api/logout`.

The login response also returns the JWT directly, but the protected backend routes currently read the token from the server session.

## Data Models

### User

Fields:

- `name`
- `email`
- `passwordHash`
- timestamps

### Post

Fields:

- `title`
- `description`
- `location`
- `image`
- `createdBy`
- `groupId`
- `members`
- timestamps

### Group

Fields:

- `postId`
- `groupName`
- `members`
- `admin`
- timestamps

## Post and Group Creation Flow

Creating a post also creates its associated group:

1. Authenticated user sends `title`, `description`, `location`, and optional `image`.
2. Backend creates a `Post` with the user as `createdBy` and first member.
3. Backend creates a `Group` linked to the post.
4. Backend updates the post with the new `groupId`.
5. Response includes both the post and group.

## Implemented Versus Referenced API

The backend currently implements authentication, post, group listing, and ping routes.

Some frontend screens reference routes that are not currently defined in `backend/routes/api.js`, including profile, notifications, support, and reset-password routes. Treat those as planned or incomplete backend features unless they are added later.
