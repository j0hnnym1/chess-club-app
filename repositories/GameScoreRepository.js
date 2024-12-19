const GameScoreDAO = require('../dao/GameScoreDAO.js');

class GameScoreRepository {
  static async getAllGameScores() {
    return await GameScoreDAO.findAll();
  }

  static async getGameScoreById(id) {
    return await GameScoreDAO.findById(id);
  }

  static async saveGameScore(data) {
    return await GameScoreDAO.create(data);
  }

  static async updateGameScore(id, data) {
    return await GameScoreDAO.updateById(id, data);
  }

  static async deleteGameScore(id) {
    return await GameScoreDAO.deleteById(id);
  }
}

module.exports = GameScoreRepository;
