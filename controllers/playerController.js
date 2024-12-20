const PlayerService = require('../services/playerService.js');

class PlayerController {
  static async getAllPlayers(req, res) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.status(200).json(players);
    } catch (err) {
      console.error('Error fetching all players:', err.message); // Debug log
      res.status(500).json({ error: 'Failed to fetch players.' });
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
      console.error('Error fetching player by ID:', err.message); // Debug log
      res.status(400).json({ error: 'Invalid player ID.' });
    }
  }

  static async createPlayer(req, res) {
    try {
      const player = await PlayerService.createPlayer(req.body);
      res.status(201).json(player);
    } catch (err) {
      console.error('Error creating player:', err.message); // Debug log
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
      console.error('Error updating player:', err.message); // Debug log
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
      console.error('Error deleting player:', err.message); // Debug log
      res.status(400).json({ error: 'Failed to delete player.' });
    }
  }
}

module.exports = PlayerController;
