const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Function to calculate average rating for an anime
const calculateAverageRating = (animeId, callback) => {
  const query = 'SELECT AVG(rating) AS average_rating FROM reviews WHERE anime_id = ?';

  db.query(query, [animeId], (error, results) => {
    if (error) {
      console.error('Error calculating average rating:', error);
      return callback(null); // Return null in case of an error
    }

    const averageRating = results[0]?.average_rating || 0; // Handle case where there are no reviews
    callback(averageRating);
  });
};

// Create a review
router.post('/:animeId/reviews', (req, res) => {
  const animeId = req.params.animeId;
  const { user_id, review_text, rating } = req.body;

  // Validate input data
  if (!animeId || !user_id || !review_text || rating == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Insert the review into the database
  const insertQuery = 'INSERT INTO reviews (anime_id, user_id, review_text, rating) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [animeId, user_id, review_text, rating], (insertError, insertResults) => {
    if (insertError) {
      console.error('Error creating review:', insertError);
      return res.status(500).json({ message: 'Error creating review' });
    }

    // Fetch the average rating after inserting the new review
    calculateAverageRating(animeId, (averageRating) => {
      if (averageRating === null) {
        return res.status(500).json({ message: 'Error fetching average rating' });
      }

      // Return the newly created review and the updated average rating
      res.status(201).json({
        id: insertResults.insertId,
        anime_id: animeId,
        user_id,
        review_text,
        rating,
        average_rating: averageRating,
      });
    });
  });
});

// Get reviews by animeID
router.get('/:animeId/reviews', (req, res) => {
  const animeId = req.params.animeId;
  db.query('SELECT * FROM reviews WHERE anime_id = ?', [animeId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create an anime
router.post('/', (req, res) => {
  const { title, genre, episodes, release_year, rating } = req.body;
  db.query('INSERT INTO animes (title, genre, episodes, release_year) VALUES (?, ?, ?, ?)', [title, genre, episodes, release_year], (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: results.insertId, title, genre, episodes, release_year });
  });
});

// Get all animes
router.get('/', (req, res) => {
  db.query('SELECT * FROM animes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Update an anime ***
router.put('/:id', (req, res) => {
  const { title, genre, episodes, release_year } = req.body;
  db.query('UPDATE animes SET title = ?, genre = ?, episodes = ?, release_year = ? WHERE id = ?', [title, genre, episodes, release_year, req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Anime updated successfully.' });
  });
});

// Get an anime ***
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM animes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Delete an anime ***
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM animes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Anime deleted successfully.' });
  });
});

module.exports = router;
