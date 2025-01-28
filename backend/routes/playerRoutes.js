const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController.js');
const PlayerStatisticsController = require('../controllers/PlayerStatisticsController.js');
const PlayerRankingsController = require('../controllers/playerRankingsController');

// Special routes first
router.get('/rankings', PlayerRankingsController.getRankings);

// Regular CRUD routes
router.get('/', PlayerController.getAllPlayers);
router.post('/', PlayerController.createPlayer);
router.get('/:id', PlayerController.getPlayerById);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

// Statistics endpoints
router.get('/:id/statistics', PlayerStatisticsController.getPlayerStatistics);
router.get('/:id/rating-history', PlayerStatisticsController.getRatingHistory);

module.exports = router;