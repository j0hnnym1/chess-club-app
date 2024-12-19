const PlayerService = require('../services/playerService.js');

class PlayerController {
  static async getAllPlayers(req, res) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.json(players);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getPlayerById(req, res) {
    try {
      const player = await PlayerService.getPlayerById(req.params.id);
      res.json(player);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async createPlayer(req, res) {
    try {
      const player = await PlayerService.createPlayer(req.body);
      res.status(201).json(player);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updatePlayer(req, res) {
    try {
      const player = await PlayerService.updatePlayer(req.params.id, req.body);
      res.json(player);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async deletePlayer(req, res) {
    try {
      const result = await PlayerService.deletePlayer(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = PlayerController;
