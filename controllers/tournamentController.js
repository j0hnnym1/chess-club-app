const TournamentService = require('../services/tournamentService.js');

class TournamentController {
  static async getAllTournaments(req, res) {
    try {
      const tournaments = await TournamentService.getAllTournaments();
      res.json(tournaments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getTournamentById(req, res) {
    try {
      const tournament = await TournamentService.getTournamentById(req.params.id);
      res.json(tournament);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async createTournament(req, res) {
    try {
      const tournament = await TournamentService.createTournament(req.body);
      res.status(201).json(tournament);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateTournament(req, res) {
    try {
      const tournament = await TournamentService.updateTournament(req.params.id, req.body);
      res.json(tournament);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async deleteTournament(req, res) {
    try {
      const result = await TournamentService.deleteTournament(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = TournamentController;
