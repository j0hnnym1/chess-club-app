const express = require('express');
const router = express.Router();
const GameScoreController = require('../controllers/gameScoreController');

router.get('/', GameScoreController.getAllGameScores);
router.get('/:id', GameScoreController.getGameScoreById);
router.post('/', GameScoreController.createGameScore);
router.put('/:id', GameScoreController.updateGameScore);
router.delete('/:id', GameScoreController.deleteGameScore);

// New route for updating game results
router.put('/:gameId/result', GameScoreController.updateGameResult);

// Dubugging
router.put('/:gameId/result', (req, res, next) => {
  console.log('PUT /api/scores/:gameId/result called');
  next();
}, GameScoreController.updateGameResult);


module.exports = router;
