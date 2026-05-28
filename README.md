# TrailLink

TrailLink is an Expo React Native app for discovering, creating, and joining trek groups. It includes a mobile frontend built with Expo Router and a Node.js/Express backend backed by MongoDB.

## Features

- User signup, login, logout, and JWT-backed sessions
- Explore feed for trek posts
- Create trek posts with title, description, location, and image selection
- Join, leave, and delete trek posts based on user role
- Group listing support connected to created posts
- Map-based navigation screen with live location, distance, pace, speed, and elevation tracking
- Profile, settings, notifications, support, and about screens

## Tech Stack

### Mobile App

- Expo SDK 52
- React Native
- TypeScript
- Expo Router
- React Navigation
- Axios
- Expo SecureStore
- Expo Location
- Expo Image Picker
- React Native Maps

### Backend

- Node.js
- Express
- MongoDB and Mongoose
- Express Session with MongoDB session storage
- JSON Web Tokens
- bcryptjs
- CORS

## Project Structure

```text
.
|-- app/                 # Expo Router screens and layouts
|   |-- auth/            # Welcome, login, signup, forgot password
|   |-- main/            # Dashboard, create post, tab navigation
|   `-- group/           # Group detail route
|-- assets/              # Images, icons, fonts, and static assets
|-- backend/             # Express API server
|   |-- config/          # MongoDB connection
|   |-- controllers/     # Auth, post, and group logic
|   |-- middleware/      # Auth middleware
|   |-- models/          # Mongoose models
|   `-- routes/          # API routes
|-- components/          # Shared React Native components
|-- constants/           # Colors, fonts, spacing, and design tokens
|-- hooks/               # Shared hooks
`-- scripts/             # Project utility scripts
```

## Prerequisites

- Node.js and npm
- Expo CLI or the Expo Go app
- MongoDB connection string
- iOS Simulator, Android Emulator, or a physical device with Expo Go

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=5000
```

### 4. Configure the mobile app API URL

The app currently uses a local network backend URL in several screens, such as:

```ts
http://192.168.4.34:5000
```

Update those constants to match the machine running the backend server. For a physical phone, use your computer's LAN IP address. For an emulator, use the appropriate emulator host address.

## Running the App

### Start the backend

From `backend/`:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

### Start the Expo app

From the project root:

```bash
npm start
```

Then open the app in Expo Go, an Android emulator, or an iOS simulator.

## Available Scripts

From the project root:

```bash
npm start        # Start the Expo development server
npm run android  # Start Expo for Android
npm run ios      # Start Expo for iOS
npm run web      # Start Expo for web
npm run lint     # Run Expo linting
npm test         # Run Jest in watch mode
```

From `backend/`:

```bash
npm start        # Run the Express server
npm run dev      # Run the Express server with nodemon
```

## API Routes

Base URL:

```text
/api
```

Routes:

```text
GET    /api/ping
POST   /api/signup
POST   /api/login
POST   /api/logout
POST   /api/posts/createPost
GET    /api/posts/listPosts
DELETE /api/posts/delete/:postId
POST   /api/posts/leave/:postId
POST   /api/posts/join/:postId
GET    /api/groups/listGroups
```

Some post routes require an authenticated session.

## Notes

- Do not commit real `.env` values or secrets.
- The backend requires a valid `MONGO_URI` before it can start successfully.
- Authentication uses both a JWT response token and an Express session stored in MongoDB.
- If requests fail from a physical device, confirm that the backend URL points to your computer's reachable LAN IP address and that both devices are on the same network.
