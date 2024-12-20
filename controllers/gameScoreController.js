const GameScore = require('../models/GameScore');
const Player = require('../models/Player');
const RatingService = require('../services/ratingService');

class GameScoreController {
  static async getAllGameScores(req, res) {
    try {
      const gameScores = await GameScore.find()
        .populate('tournamentId')
        .populate('player1Id')
        .populate('player2Id');
      res.json(gameScores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getGameScoreById(req, res) {
    try {
      const gameScore = await GameScore.findById(req.params.id)
        .populate('tournamentId')
        .populate('player1Id')
        .populate('player2Id');
      if (!gameScore) {
        return res.status(404).json({ error: 'Game score not found' });
      }
      res.json(gameScore);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async createGameScore(req, res) {
    try {
      const { tournamentId, player1Id, player2Id, result } = req.body;
      const newGameScore = new GameScore({ tournamentId, player1Id, player2Id, result });
      await newGameScore.save();
      res.status(201).json(newGameScore);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateGameScore(req, res) {
    try {
      const updatedGameScore = await GameScore.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updatedGameScore) {
        return res.status(404).json({ error: 'Game score not found' });
      }
      res.json(updatedGameScore);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteGameScore(req, res) {
    try {
      const deletedGameScore = await GameScore.findByIdAndDelete(req.params.id);
      if (!deletedGameScore) {
        return res.status(404).json({ error: 'Game score not found' });
      }
      res.json({ message: 'Game score deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // New Method: Update Game Result and Player Ratings
  static async updateGameResult(req, res) {
    //Debugging
    console.log('updateGameResult called with:', req.body);
    try {
      const { gameId, result } = req.body;

      // Fetch the game details
      const game = await GameScore.findById(gameId);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const player1 = await Player.findById(game.player1Id);
      const player2 = await Player.findById(game.player2Id);

      if (!player1 || !player2) {
        return res.status(404).json({ error: 'Players not found' });
      }

      // Calculate new ratings
      const { newRatingA, newRatingB } = RatingService.calculateNewRatings(player1, player2, result);

      // Update players' ratings
      player1.rating = newRatingA;
      player2.rating = newRatingB;

      await player1.save();
      await player2.save();

      // Update game result
      game.result = result;
      await game.save();

      res.json({ message: 'Game result and ratings updated', game });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = GameScoreController;
