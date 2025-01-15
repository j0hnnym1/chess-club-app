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

  static async updateGameResult(req, res) {
    console.log('=== updateGameResult called ===');
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);
    
    try {
      const { gameId, result } = req.body;
      console.log('Looking for game with ID:', gameId);

      const game = await GameScore.findById(gameId || req.params.gameId);
      console.log('Found game:', game);
      
      if (!game) {
        console.error('Game not found with ID:', gameId || req.params.gameId);
        return res.status(404).json({ error: 'Game not found' });
      }

      console.log('Fetching players...');
      console.log('Player1 ID:', game.player1Id);
      console.log('Player2 ID:', game.player2Id);

      const player1 = await Player.findById(game.player1Id);
      const player2 = await Player.findById(game.player2Id);
      
      console.log('Found player1:', player1);
      console.log('Found player2:', player2);

      if (!player1 || !player2) {
        console.error('Players not found:', { player1Id: game.player1Id, player2Id: game.player2Id });
        return res.status(404).json({ error: 'Players not found' });
      }

      console.log('Current ratings - Player1:', player1.rating, 'Player2:', player2.rating);
      console.log('Calculating new ratings for result:', result);

      const {
        newRatingA,
        newRatingDeviationA,
        newVolatilityA,
        newRatingB,
        newRatingDeviationB,
        newVolatilityB
      } = RatingService.calculateNewRatings(player1, player2, result);

      console.log('New calculated ratings:', {
        player1: {
          before: player1.rating,
          after: newRatingA,
          deviation: newRatingDeviationA,
          volatility: newVolatilityA
        },
        player2: {
          before: player2.rating,
          after: newRatingB,
          deviation: newRatingDeviationB,
          volatility: newVolatilityB
        }
      });

      // Update player1
      player1.rating = newRatingA;
      player1.ratingDeviation = newRatingDeviationA;
      player1.volatility = newVolatilityA;
      player1.lastPlayed = new Date();

      // Update player2
      player2.rating = newRatingB;
      player2.ratingDeviation = newRatingDeviationB;
      player2.volatility = newVolatilityB;
      player2.lastPlayed = new Date();

      console.log('Saving updated player1:', player1);
      console.log('Saving updated player2:', player2);

      const savedPlayer1 = await player1.save();
      const savedPlayer2 = await player2.save();

      console.log('Players saved successfully');
      console.log('Saved player1:', savedPlayer1);
      console.log('Saved player2:', savedPlayer2);

      game.result = result;
      const savedGame = await game.save();
      console.log('Game updated successfully:', savedGame);

      res.json({ 
        message: 'Game result and ratings updated', 
        game: savedGame,
        player1Ratings: {
          rating: savedPlayer1.rating,
          ratingDeviation: savedPlayer1.ratingDeviation,
          volatility: savedPlayer1.volatility
        },
        player2Ratings: {
          rating: savedPlayer2.rating,
          ratingDeviation: savedPlayer2.ratingDeviation,
          volatility: savedPlayer2.volatility
        }
      });
    } catch (err) {
      console.error('=== Error in updateGameResult ===');
      console.error('Error details:', err);
      console.error('Stack trace:', err.stack);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = GameScoreController;