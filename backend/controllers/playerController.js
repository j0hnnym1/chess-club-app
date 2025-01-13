const PlayerService = require('../services/playerService.js');
const Player = require('../models/Player');
const GameScore = require('../models/GameScore');

class PlayerController {
  static async getAllPlayers(req, res) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.status(200).json(players);
    } catch (err) {
      console.error('Error fetching all players:', err.message);
      res.status(500).json({ error: 'Failed to fetch players.' });
    }
  }

  static async getRankings(req, res) {
    console.log('Getting player rankings');
    console.log('Request headers:', req.headers);
    console.log('Request query params:', req.query);
    try {
      // Get all players with their games
      const players = await Player.find().lean();
      console.log('Found players:', players);

      const rankings = await Promise.all(players.map(async (player) => {
        console.log('Processing player:', player);
        
        // Get all games for this player
        const games = await GameScore.find({
          $or: [
            { player1Id: player._id },
            { player2Id: player._id }
          ]
        }).lean();
        
        console.log('Games for player:', games);

        // Calculate statistics
        let wins = 0;
        let losses = 0;
        let draws = 0;

        games.forEach(game => {
          if (game.result === 'Player1' && game.player1Id.equals(player._id)) wins++;
          else if (game.result === 'Player2' && game.player2Id.equals(player._id)) wins++;
          else if (game.result === 'Draw') draws++;
          else if (game.result !== 'Pending' && game.result !== null) losses++;
        });

        return {
          ...player,
          gamesPlayed: games.length,
          wins,
          losses,
          draws,
          winPercentage: games.length > 0 ? (wins / games.length) * 100 : 0
        };
      }));

      // Sort by rating and win percentage
      rankings.sort((a, b) => {
        if (b.rating === a.rating) {
          return b.winPercentage - a.winPercentage;
        }
        return b.rating - a.rating;
      });

      res.json(rankings);
    } catch (err) {
      console.error('Error getting rankings:', err);
      res.status(500).json({ error: 'Failed to get rankings' });
    }
  }

  static async getPlayerById(req, res) {
    try {
      const player = await PlayerService.getPlayerById(req.params.id);
      if (!player) {
        return res.status(404).json({ error: 'Player not found.' });
      }
      res.status(200).json(player);
    } catch (err) {
      console.error('Error fetching player by ID:', err.message);
      res.status(400).json({ error: 'Invalid player ID.' });
    }
  }

  static async createPlayer(req, res) {
    try {
      const player = await PlayerService.createPlayer(req.body);
      res.status(201).json(player);
    } catch (err) {
      console.error('Error creating player:', err.message);
      res.status(400).json({ error: 'Failed to create player.' });
    }
  }

  static async updatePlayer(req, res) {
    try {
      const player = await PlayerService.updatePlayer(req.params.id, req.body);
      if (!player) {
        return res.status(404).json({ error: 'Player not found.' });
      }
      res.status(200).json(player);
    } catch (err) {
      console.error('Error updating player:', err.message);
      res.status(400).json({ error: 'Failed to update player.' });
    }
  }

  static async deletePlayer(req, res) {
    try {
      const result = await PlayerService.deletePlayer(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Player not found.' });
      }
      res.status(200).json({ message: 'Player deleted successfully.' });
    } catch (err) {
      console.error('Error deleting player:', err.message);
      res.status(400).json({ error: 'Failed to delete player.' });
    }
  }
}

module.exports = PlayerController;