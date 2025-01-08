const TournamentService = require('../services/tournamentService.js');
const Player = require('../models/Player.js');
const GameScore = require('../models/GameScore.js');
const SwissPairingService = require('../services/swissPairingService.js');
const Tournament = require('../models/Tournament');
const mongoose = require('mongoose');

class TournamentController {
  static async getAllTournaments(req, res) {
    try {
      console.log('Fetching all tournaments...'); // Debugging
      const tournaments = await TournamentService.getAllTournaments();
      console.log('Tournaments fetched successfully:', tournaments.length); // Debugging
      return res.json(tournaments);
    } catch (err) {
      console.error('Error fetching all tournaments:', err.message);
      return res.status(500).json({ error: 'Failed to fetch tournaments.' });
    }
  }

  static async getTournamentById(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching tournament with ID:', id); // Debugging

      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.warn('Invalid tournament ID:', id); // Debugging
        return res.status(400).json({ error: 'Invalid tournament ID' });
      }

      const tournament = await Tournament.findById(id);
      if (!tournament) {
        console.warn('Tournament not found with ID:', id); // Debugging
        return res.status(404).json({ error: 'Tournament not found' });
      }

      console.log('Tournament fetched successfully:', tournament); // Debugging
      return res.json(tournament);
    } catch (err) {
      console.error('Error fetching tournament:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static async createTournament(req, res) {
    try {
      const { name, date, type, players } = req.body;
      const hostId = req.user.id;
  
      // Validate players
      const validPlayers = await Player.find({ _id: { $in: players } });
      if (validPlayers.length !== players.length) {
        return res.status(400).json({ error: 'One or more players are invalid' });
      }
  
      const tournament = new Tournament({
        name,
        date,
        type,
        hostId,
        players, // Save the validated players
      });
  
      await tournament.save();
      res.status(201).json(tournament);
    } catch (err) {
      console.error('Error creating tournament:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
  
  static async updateTournament(req, res) {
    try {
      const { id } = req.params;
      const { players, ...updates } = req.body;
  
      const tournament = await Tournament.findById(id);
      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      // Validate players
      if (players) {
        const validPlayers = await Player.find({ _id: { $in: players } });
        if (validPlayers.length !== players.length) {
          return res.status(400).json({ error: 'One or more players are invalid' });
        }
        tournament.players = players; // Update with valid IDs
      }
  
      Object.assign(tournament, updates);
      await tournament.save();
  
      res.status(200).json(tournament);
    } catch (err) {
      console.error('Error updating tournament:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async deleteTournament(req, res) {
    try {
      const { id } = req.params;
      console.log('Received DELETE request for tournament with ID:', id); // Debugging
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.warn('Invalid tournament ID:', id); // Debugging
        return res.status(400).json({ error: 'Invalid tournament ID' });
      }
  
      const deletedTournament = await Tournament.findByIdAndDelete(id);
      if (!deletedTournament) {
        console.warn('Tournament not found for deletion with ID:', id); // Debugging
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      console.log('Tournament deleted successfully:', deletedTournament); // Debugging
      return res.status(200).json({ message: 'Tournament deleted successfully' });
    } catch (err) {
      console.error('Error in deleteTournament:', err.message, err.stack); // Debugging
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async generatePairings(req, res) {
    try {
      const { tournamentId } = req.params;
      console.log('Generating pairings for tournament ID:', tournamentId); // Debugging

      if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        console.warn('Invalid tournament ID for pairings:', tournamentId); // Debugging
        return res.status(400).json({ error: 'Invalid tournament ID' });
      }

      const players = await Player.find({ tournamentId });
      if (!players || players.length === 0) {
        console.warn('No players found for tournament ID:', tournamentId); // Debugging
        return res.status(404).json({ error: 'No players found for this tournament.' });
      }

      const pairings = SwissPairingService.createPairings(players);
      console.log('Pairings generated successfully:', pairings); // Debugging

      const games = await Promise.all(
        pairings.map(async ({ player1, player2 }) => {
          const game = await GameScore.create({
            tournamentId,
            player1Id: player1._id,
            player2Id: player2 ? player2._id : null,
            result: player2 ? 'Pending' : 'Bye',
          });
          console.log('Game created:', game); // Debugging
          return game;
        })
      );

      console.log('Pairings and games created successfully'); // Debugging
      return res.status(200).json({ pairings, games });
    } catch (err) {
      console.error('Error generating pairings:', err.message);
      return res.status(500).json({ error: 'Failed to generate pairings.' });
    }
  }

  static async startTournament(req, res) {
    try {
      console.log('Starting tournament:', req.params.id);
      const tournament = await Tournament.findById(req.params.id).populate('players');

      if (!tournament) {
        console.log('Tournament not found');
        return res.status(404).json({ error: 'Tournament not found' });
      }

      if (tournament.status !== 'pending') {
        console.log('Tournament already started');
        return res.status(400).json({ error: 'Tournament has already started' });
      }

      // Create initial pairings
      const players = [...tournament.players];
      console.log('Players for initial pairings:', players);

      const pairings = [];
      // Shuffle players randomly
      for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
      }

      // Create pairings
      for (let i = 0; i < players.length; i += 2) {
        const pairing = {
          player1: players[i]._id,
          player2: i + 1 < players.length ? players[i + 1]._id : null,
          result: i + 1 >= players.length ? 'bye' : null
        };
        console.log('Created pairing:', pairing);
        pairings.push(pairing);
      }

      // Create first round
      const firstRound = {
        roundNumber: 1,
        pairings: pairings,
        completed: false,
        startTime: new Date()
      };

      tournament.rounds = [firstRound];
      tournament.status = 'in_progress';
      tournament.currentRound = 1;

      console.log('Created first round:', firstRound);
      await tournament.save();

      res.json(tournament);
    } catch (err) {
      console.error('Error starting tournament:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = TournamentController;