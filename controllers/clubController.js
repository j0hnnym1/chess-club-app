const ClubService = require('../services/clubService.js');

class ClubController {
  static async getAllClubs(req, res) {
    try {
      const clubs = await ClubService.getAllClubs();
      res.json(clubs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getClubById(req, res) {
    try {
      const club = await ClubService.getClubById(req.params.id);
      res.json(club);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async createClub(req, res) {
    try {
      const club = await ClubService.createClub(req.body);
      res.status(201).json(club);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateClub(req, res) {
    try {
      const club = await ClubService.updateClub(req.params.id, req.body);
      res.json(club);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async deleteClub(req, res) {
    try {
      const result = await ClubService.deleteClub(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = ClubController;
