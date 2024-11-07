// routes/animes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create an anime
router.post('/', (req, res) => {
  const { title, genre, episodes, release_year, rating } = req.body;
  db.query('INSERT INTO animes (title, genre, episodes, release_year, rating) VALUES (?, ?, ?, ?, ?)', [title, genre, episodes, release_year, rating], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, title, genre, episodes, release_year, rating });
  });
});

// Read all animes
router.get('/', (req, res) => {
  db.query('SELECT * FROM animes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Read a single anime
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM animes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Update an anime
router.put('/:id', (req, res) => {
  const { title, genre, episodes, release_year, rating } = req.body;
  db.query('UPDATE animes SET title = ?, genre = ?, episodes = ?, release_year = ?, rating = ? WHERE id = ?', [title, genre, episodes, release_year, rating, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Anime updated successfully.' });
  });
});

// Delete an anime
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM animes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Anime deleted successfully.' });
  });
});

module.exports = router;
