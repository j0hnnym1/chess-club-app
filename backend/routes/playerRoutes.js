const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', PlayerController.getAllPlayers);
router.get('/rankings', PlayerController.getRankings);
router.get('/:id', PlayerController.getPlayerById);
router.post('/', PlayerController.createPlayer);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

module.exports = router;