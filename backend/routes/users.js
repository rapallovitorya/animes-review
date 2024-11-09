// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Find the user
  const sql = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Optional: return username on successful login
    const user = results[0];
    res.status(200).json({ id: user.id, username: user.username, email: user.email, message: 'Login successful' });
  });
});

// Get all users ***
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get a user ***
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Signup ***
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  db.query('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, username, email });
  });
});

// Update a user ***
router.put('/:id', (req, res) => {
  const { username, email, password } = req.body;
  db.query('UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?', [username, email, password, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User updated successfully.' });
  });
});

// Delete a user ***
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User deleted successfully.' });
  });
});

module.exports = router;