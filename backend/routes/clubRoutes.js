const express = require('express');
const router = express.Router();
const ClubController = require('../controllers/clubController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Club Routes
router.get('/', (req, res, next) => {
  console.log('GET /api/clubs called'); // Debugging
  next();
}, ClubController.getAllClubs);

router.get('/:id', (req, res, next) => {
  console.log(`GET /api/clubs/${req.params.id} called`); // Debugging
  next();
}, ClubController.getClubById);

router.post('/', async (req, res) => {
  try {
    console.log('POST /api/clubs called with body:', req.body); // Debugging
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required.' });
    }

    const club = await ClubController.createClub(req, res);
    res.status(201).json(club);
  } catch (err) {
    console.error('Error creating club:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log(`PUT /api/clubs/${req.params.id} called with body:`, req.body); // Debugging
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required.' });
    }

    const club = await ClubController.updateClub(req, res);
    res.status(200).json(club);
  } catch (err) {
    console.error('Error updating club:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res, next) => {
  console.log(`DELETE /api/clubs/${req.params.id} called`); // Debugging
  next();
}, ClubController.deleteClub);

router.get('/:id/players', (req, res, next) => {
  console.log(`GET /api/clubs/${req.params.id}/players called`); // Debug
  next();
}, ClubController.getClubPlayers);

module.exports = router;
