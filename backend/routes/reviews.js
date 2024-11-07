const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a review
router.post('/', (req, res) => {
  const { anime_id, user_id, review_text, rating } = req.body;
  db.query('INSERT INTO reviews (anime_id, user_id, review_text, rating) VALUES (?, ?, ?, ?)', [anime_id, user_id, review_text, rating], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, anime_id, user_id, review_text, rating });
  });
});

// Read all reviews
router.get('/', (req, res) => {
  db.query('SELECT * FROM reviews', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Read a single review
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM reviews WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Update a review
router.put('/:id', (req, res) => {
  const { anime_id, user_id, review_text, rating } = req.body;
  db.query('UPDATE reviews SET anime_id = ?, user_id = ?, review_text = ?, rating = ? WHERE id = ?', [anime_id, user_id, review_text, rating, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Review updated successfully.' });
  });
});

// Delete a review
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM reviews WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Review deleted successfully.' });
  });
});

module.exports = router;
