const TournamentService = require('../services/tournamentService.js');
const Player = require('../models/Player.js');
const GameScore = require('../models/GameScore.js');
const SwissPairingService = require('../services/swissPairingService.js');

class TournamentController {
  static async getAllTournaments(req, res) {
    try {
      const tournaments = await TournamentService.getAllTournaments();
      res.json(tournaments);
    } catch (err) {
      console.error('Error fetching all tournaments:', err.message);
      res.status(500).json({ error: 'Failed to fetch tournaments.' });
    }
  }

  static async getTournamentById(req, res) {
    try {
      const tournament = await TournamentService.getTournamentById(req.params.id);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found.' });
      }
      res.json(tournament);
    } catch (err) {
      console.error('Error fetching tournament by ID:', err.message);
      res.status(404).json({ error: 'Invalid tournament ID.' });
    }
  }

  static async createTournament(req, res) {
    try {
      const { name, date, type, players } = req.body;

      // Ensure hostId is taken from the authenticated user
      const hostId = req.user.id;

      // Pass the hostId and other data to the service
      const tournament = await TournamentService.createTournament({
        name,
        date,
        type,
        hostId,
        players,
      });

      res.status(201).json(tournament);
    } catch (err) {
      console.error('Error creating tournament:', err.message);
      res.status(400).json({ error: 'Failed to create tournament.' });
    }
  }

  static async updateTournament(req, res) {
    try {
      const tournament = await TournamentService.updateTournament(req.params.id, req.body);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found.' });
      }
      res.json(tournament);
    } catch (err) {
      console.error('Error updating tournament:', err.message);
      res.status(400).json({ error: 'Failed to update tournament.' });
    }
  }

  static async deleteTournament(req, res) {
    try {
      const result = await TournamentService.deleteTournament(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Tournament not found.' });
      }
      res.json({ message: 'Tournament deleted successfully.' });
    } catch (err) {
      console.error('Error deleting tournament:', err.message);
      res.status(400).json({ error: 'Failed to delete tournament.' });
    }
  }

  // Generate Swiss Pairings
  static async generatePairings(req, res) {
    try {
      const { tournamentId } = req.params;

      // Fetch players in the tournament
      const players = await Player.find({ tournamentId });

      if (!players || players.length === 0) {
        return res.status(404).json({ error: 'No players found for this tournament.' });
      }

      // Generate Swiss pairings
      const pairings = SwissPairingService.createPairings(players);

      // Create games in the database
      const games = await Promise.all(
        pairings.map(async ({ player1, player2 }) => {
          return GameScore.create({
            tournamentId,
            player1Id: player1._id,
            player2Id: player2 ? player2._id : null,
            result: player2 ? 'Pending' : 'Bye',
          });
        })
      );

      res.status(200).json({ pairings, games });
    } catch (err) {
      console.error('Error generating pairings:', err.message);
      res.status(500).json({ error: 'Failed to generate pairings.' });
    }
  }
}

module.exports = TournamentController;
