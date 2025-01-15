const express = require('express');
const router = express.Router();
const GameScoreController = require('../controllers/gameScoreController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', GameScoreController.getAllGameScores);
router.get('/:id', GameScoreController.getGameScoreById);
router.post('/', GameScoreController.createGameScore);
router.put('/:id', GameScoreController.updateGameScore);
router.delete('/:id', GameScoreController.deleteGameScore);

// Route for updating game results
router.put('/:gameId/result', async (req, res, next) => {
  console.log('PUT /api/scores/:gameId/result called with:');
  console.log('GameID:', req.params.gameId);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
}, GameScoreController.updateGameResult);

module.exports = router;