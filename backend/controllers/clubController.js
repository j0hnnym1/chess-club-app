const ClubService = require('../services/clubService.js');

class ClubController {
  static async getAllClubs(req, res) {
    try {
      console.log('ClubController.getAllClubs called'); // Debugging
      const clubs = await ClubService.getAllClubs();
      res.json(clubs);
    } catch (err) {
      console.error('Error in getAllClubs:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  static async getClubById(req, res) {
    try {
      console.log(`ClubController.getClubById called with ID: ${req.params.id}`); // Debugging
      const club = await ClubService.getClubById(req.params.id);
      res.json(club);
    } catch (err) {
      console.error('Error in getClubById:', err.message);
      res.status(404).json({ error: err.message });
    }
  }

  static async createClub(req, res) {
    try {
      console.log('ClubController.createClub called with data:', req.body); // Debugging
      const club = await ClubService.createClub(req.body);
      res.status(201).json(club);
    } catch (err) {
      console.error('Error in createClub:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  static async updateClub(req, res) {
    try {
      console.log(`ClubController.updateClub called with ID: ${req.params.id} and data:`, req.body); // Debugging
      const club = await ClubService.updateClub(req.params.id, req.body);
      res.json(club);
    } catch (err) {
      console.error('Error in updateClub:', err.message);
      res.status(404).json({ error: err.message });
    }
  }

  static async deleteClub(req, res) {
    try {
      console.log(`ClubController.deleteClub called with ID: ${req.params.id}`); // Debugging
      const result = await ClubService.deleteClub(req.params.id);
      res.json(result);
    } catch (err) {
      console.error('Error in deleteClub:', err.message);
      res.status(404).json({ error: err.message });
    }
  }

  static async getClubPlayers(req, res) {
    try {
      console.log(`ClubController.getClubPlayers called with ID: ${req.params.id}`); // Debug
      const players = await Player.find({ clubId: req.params.id });
      console.log('Found club players:', players); // Debug
      res.json(players);
    } catch (err) {
      console.error('Error in getClubPlayers:', err.message);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ClubController;
