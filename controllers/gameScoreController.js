const GameScoreService = require('../services/gameScoreService.js');

class GameScoreController {
  static async getAllGameScores(req, res) {
    console.log('getAllGameScores called');
    try {
      const scores = await GameScoreService.getAllGameScores();
      res.json(scores);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getGameScoreById(req, res) {
    try {
      const score = await GameScoreService.getGameScoreById(req.params.id);
      res.json(score);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async createGameScore(req, res) {
    try {
      const score = await GameScoreService.createGameScore(req.body);
      res.status(201).json(score);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateGameScore(req, res) {
    try {
      const score = await GameScoreService.updateGameScore(req.params.id, req.body);
      res.json(score);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async deleteGameScore(req, res) {
    try {
      const result = await GameScoreService.deleteGameScore(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = GameScoreController;
