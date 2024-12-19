const express = require('express');
const router = express.Router();
const GameScoreController = require('../controllers/gameScoreController.js');

router.get('/', GameScoreController.getAllGameScores);
router.get('/:id', GameScoreController.getGameScoreById);
router.post('/', GameScoreController.createGameScore);
router.put('/:id', GameScoreController.updateGameScore);
router.delete('/:id', GameScoreController.deleteGameScore);

module.exports = router;
