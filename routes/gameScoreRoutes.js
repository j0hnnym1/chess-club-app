const express = require('express');
const router = express.Router();
const GameScoreController = require('../controllers/gameScoreController.js');
//console.log('gameScoreRoutes.js loaded');

router.get('/', GameScoreController.getAllGameScores);
router.get('/:id', GameScoreController.getGameScoreById);
router.post('/', GameScoreController.createGameScore);
router.put('/:id', GameScoreController.updateGameScore);
router.delete('/:id', GameScoreController.deleteGameScore);


//console.log('Exporting gameScoreRoutes:', router);
module.exports = router;
