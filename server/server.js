const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Data is stored as one JSON object per line in this text file
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.txt');

app.use(cors());          // allow requests from your React dev server (e.g. localhost:3000)
app.use(express.json());  // parse incoming JSON bodies

// Make sure the data folder/file exist before the server starts handling requests
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '');
  }
}

function readUsers() {
  const content = fs.readFileSync(DATA_FILE, 'utf-8').trim();
  if (!content) return [];
  return content
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function appendUser(user) {
  fs.appendFileSync(DATA_FILE, JSON.stringify(user) + '\n');
}

/**
 * POST /api/register
 * Accepts the account/profile JSON from the React form and appends it
 * as one line to data/users.txt.
 * Required fields: username, password
 */
app.post('/api/register', (req, res) => {
  const userData = req.body || {};

  if (!userData.username || !userData.password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const users = readUsers();
  const alreadyExists = users.some((u) => u.username === userData.username);

  if (alreadyExists) {
    return res.status(409).json({ error: 'A user with that username already exists' });
  }

  appendUser({
    ...userData,
    createdAt: new Date().toISOString(),
  });

  return res.status(201).json({ message: 'Registration successful' });
});

/**
 * POST /api/login
 * Accepts { username, password }, checks against data/users.txt.
 * Returns 200 on success, 401 on bad credentials, 400 on missing fields.
 */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const { password: _pw, ...safeUser } = user; // never send the password back
  return res.status(200).json({ message: 'Login successful', user: safeUser });
});

// Simple health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

ensureDataFile();
app.listen(PORT, () => {
  console.log(`Account API running at http://localhost:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
});
