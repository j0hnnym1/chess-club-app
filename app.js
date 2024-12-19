const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routes
const playerRoutes = require('./routes/playerRoutes.js');
const clubRoutes = require('./routes/clubRoutes.js');
const tournamentRoutes = require('./routes/tournamentRoutes.js');
const gameScoreRoutes = require('./routes/gameScoreRoutes.js');

// Define API routes
app.use('/api/players', playerRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/scores', gameScoreRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Chess Club App is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
