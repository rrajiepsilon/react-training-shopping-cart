# Account API (local backend for your React app)

A minimal Express server with two endpoints. User data is stored as plain
JSON lines in `data/users.txt` (created automatically on first run).

## Setup

```bash
cd server
npm install
npm start
```

From the repo root you can also run `npm run dev:api`.

Server runs at `http://localhost:5000`.

## Endpoints

### 1. Register — `POST /api/register`
Accepts any JSON object as the request body (e.g. the fields from your
registration form) and appends it as a new line to `data/users.txt`.

Required fields: `username`, `password`

**Request**
```json
{
  "username": "johndoe",
  "password": "secret123",
  "email": "john.doe@example.com",
  "fullName": "John Doe"
}
```

**Responses**
- `201` → `{ "message": "Registration successful" }`
- `400` → `{ "error": "username and password are required" }`
- `409` → `{ "error": "A user with that username already exists" }`

### 2. Login — `POST /api/login`
**Request**
```json
{ "username": "johndoe", "password": "secret123" }
```

**Responses**
- `200` → `{ "message": "Login successful", "user": { ...user fields, no password } }`
- `400` → `{ "error": "username and password are required" }`
- `401` → `{ "error": "Invalid username or password" }`

## Calling it from React

```js
// register
await fetch('http://localhost:5000/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

// login
const res = await fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});
const data = await res.json();
if (res.ok) {
  // logged in — data.user has the profile
} else {
  // data.error has the message
}
```

## Notes / next steps
- Passwords are stored in plain text in this simple version — fine for a
  local proof-of-concept, but before this touches anything real you'd want
  to hash passwords (e.g. with `bcrypt`) rather than store them as-is.
- `data/users.txt` is just plain text (one JSON object per line) so you can
  open it directly to see what's been captured.
- CORS is wide open (`cors()`) so your React dev server can call it freely
  during local development.
