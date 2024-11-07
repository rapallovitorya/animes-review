const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const animesRoutes = require('./routes/animes');
const reviewsRoutes = require('./routes/reviews');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/animes', animesRoutes);
app.use('/api/reviews', reviewsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
