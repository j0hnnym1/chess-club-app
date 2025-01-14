const PlayerService = require('../services/playerService.js');
const Player = require('../models/Player');
const Tournament = require('../models/Tournament');

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
      // Get all players
      const players = await Player.find().lean();
      console.log('Found players:', players);

      // Get all tournaments
      const tournaments = await Tournament.find()
        .populate('rounds.pairings.white')
        .populate('rounds.pairings.black')
        .lean();
      console.log('Found tournaments:', tournaments);

      const rankings = await Promise.all(players.map(async (player) => {
        console.log('Processing player:', player);
        
        let totalWins = 0;
        let totalLosses = 0;
        let totalDraws = 0;
        let gamesPlayed = 0;

        // Loop through all tournaments
        for (const tournament of tournaments) {
          for (const round of tournament.rounds || []) {
            if (!round.completed) continue;

            for (const pairing of round.pairings || []) {
              const isWhite = pairing.white && pairing.white._id.toString() === player._id.toString();
              const isBlack = pairing.black && pairing.black._id.toString() === player._id.toString();

              if (!isWhite && !isBlack) continue;

              if (pairing.result === 'bye') {
                totalWins++;
                gamesPlayed++;
              } else if (pairing.result) {
                gamesPlayed++;
                if ((isWhite && pairing.result === '1-0') || (isBlack && pairing.result === '0-1')) {
                  totalWins++;
                } else if ((isWhite && pairing.result === '0-1') || (isBlack && pairing.result === '1-0')) {
                  totalLosses++;
                } else if (pairing.result === '0.5-0.5') {
                  totalDraws++;
                }
              }
            }
          }
        }

        console.log('Stats for player', player.name, ':', {
          gamesPlayed,
          wins: totalWins,
          losses: totalLosses,
          draws: totalDraws
        });

        return {
          ...player,
          gamesPlayed,
          wins: totalWins,
          losses: totalLosses,
          draws: totalDraws,
          winRate: gamesPlayed > 0 ? 
            ((totalWins + (totalDraws * 0.5)) / gamesPlayed * 100).toFixed(1) : 
            '-'
        };
      }));

      // Sort by rating descending
      rankings.sort((a, b) => b.rating - a.rating);

      console.log('Sending rankings response:', rankings.length, 'players');
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