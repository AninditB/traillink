# API Reference

Base URL:

```text
http://localhost:5000/api
```

For a physical device running Expo Go, replace `localhost` with the backend machine's LAN IP address.

## Authentication

Protected routes use `authMiddleware`, which expects a valid JWT in `req.session.jwt`. Login sets this session value. Client requests to protected endpoints should preserve cookies, for example with Axios `withCredentials: true`.

## Health

### `GET /api/ping`

Returns a simple API health response.

Response:

```json
{ "message": "Pong!" }
```

## Users

### `POST /api/signup`

Registers a new user.

Body:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "password123"
}
```

Success response:

```json
{ "message": "User registered successfully" }
```

Common errors:

- `400`: missing fields
- `400`: user already exists
- `500`: server error

### `POST /api/login`

Logs in a user, stores a JWT in the server session, and returns the token.

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Success response:

```json
{
  "message": "Login successful",
  "user": {
    "name": "Example User",
    "email": "user@example.com"
  },
  "token": "jwt-token",
  "sessionSet": true
}
```

Common errors:

- `400`: missing email or password
- `401`: invalid credentials
- `500`: server error

### `POST /api/logout`

Destroys the active session.

Success response:

```json
{ "message": "Logout successful" }
```

## Posts

### `POST /api/posts/createPost`

Creates a trek post and a linked group.

Authentication: required.

Body:

```json
{
  "title": "Morning Trek",
  "description": "A short group trek.",
  "location": "Austin, TX",
  "image": "optional-image-uri"
}
```

Success response includes:

- `message`
- `post`
- `group`

Common errors:

- `400`: missing required fields
- `401`: unauthorized
- `500`: server error

### `GET /api/posts/listPosts`

Returns all posts. Each post populates `createdBy` and `groupId`.

Authentication: not required.

Success response:

```json
[
  {
    "_id": "post-id",
    "title": "Morning Trek",
    "description": "A short group trek.",
    "location": "Austin, TX",
    "image": "optional-image-uri",
    "createdBy": {
      "_id": "user-id",
      "name": "Example User",
      "email": "user@example.com"
    },
    "groupId": {
      "_id": "group-id"
    },
    "members": ["user-id"]
  }
]
```

### `POST /api/posts/join/:postId`

Adds the authenticated user to a post and its linked group.

Authentication: required.

Success response:

```json
{
  "message": "Joined post successfully",
  "groupId": "group-id"
}
```

Common errors:

- `400`: user is already in the group
- `401`: unauthorized
- `404`: post not found
- `500`: server error

### `POST /api/posts/leave/:postId`

Removes the authenticated user from a post and its linked group. If the post creator leaves, the post and group are deleted.

Authentication: required.

Success response:

```json
{ "message": "You have left the post and group successfully" }
```

Common errors:

- `400`: user is not a member
- `401`: unauthorized
- `404`: post or group not found
- `500`: server error

### `DELETE /api/posts/delete/:postId`

Deletes a post and its linked group. Only the post creator can delete.

Authentication: required.

Success response:

```json
{ "message": "Post and associated group deleted successfully" }
```

Common errors:

- `401`: unauthorized
- `403`: authenticated user is not the post creator
- `404`: post not found
- `500`: server error

## Groups

### `GET /api/groups/listGroups`

Returns all groups. Each group populates linked post, admin, and members.

Authentication: not required.

Success response:

```json
[
  {
    "_id": "group-id",
    "postId": {
      "_id": "post-id",
      "title": "Morning Trek",
      "location": "Austin, TX"
    },
    "groupName": "Morning Trek - Trekking Group",
    "members": [
      {
        "_id": "user-id",
        "name": "Example User",
        "email": "user@example.com"
      }
    ],
    "admin": {
      "_id": "user-id",
      "name": "Example User",
      "email": "user@example.com"
    }
  }
]
```

## Frontend-Referenced Routes Not Currently Implemented

The frontend references these routes, but they are not currently defined in `backend/routes/api.js`:

- `POST /api/reset-password`
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `DELETE /api/notifications/clear`
- support request route from `app/main/tabs/profile/support.tsx`

Add backend routes and controllers before relying on those screens in production.
