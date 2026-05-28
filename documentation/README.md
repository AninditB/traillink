# TrailLink Documentation

This folder contains project documentation for the TrailLink mobile app and backend API.

## Documents

- [Setup Guide](./setup.md): install dependencies, configure environment variables, and run the app.
- [Architecture](./architecture.md): project structure, frontend flow, backend flow, and data model overview.
- [API Reference](./api.md): implemented backend routes, request bodies, responses, and authentication notes.
- [Contributing Guide](./contributing.md): development workflow, coding notes, and testing checklist.

## Project Summary

TrailLink is an Expo React Native app for creating, discovering, joining, and managing trekking groups. The frontend uses Expo Router and React Native. The backend uses Express, MongoDB, Mongoose, sessions, and JSON Web Tokens.

The app currently expects a backend running on a reachable local network address. Several frontend screens use a hard-coded API host, so update those constants before running on a different machine or network.
