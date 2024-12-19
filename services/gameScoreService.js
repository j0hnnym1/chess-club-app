const GameScoreRepository = require('../repositories/GameScoreRepository.js');
const GameScoreDTO = require('../dto/GameScoreDTO.js');

class GameScoreService {
  static async getAllGameScores() {
    const scores = await GameScoreRepository.getAllGameScores();
    return scores.map(score => new GameScoreDTO(score));
  }

  static async getGameScoreById(id) {
    const score = await GameScoreRepository.getGameScoreById(id);
    if (!score) throw new Error('GameScore not found');
    return new GameScoreDTO(score);
  }

  static async createGameScore(data) {
    const score = await GameScoreRepository.saveGameScore(data);
    return new GameScoreDTO(score);
  }

  static async updateGameScore(id, data) {
    const score = await GameScoreRepository.updateGameScore(id, data);
    if (!score) throw new Error('GameScore not found');
    return new GameScoreDTO(score);
  }

  static async deleteGameScore(id) {
    const score = await GameScoreRepository.deleteGameScore(id);
    if (!score) throw new Error('GameScore not found');
    return { message: 'GameScore deleted' };
  }
}

module.exports = GameScoreService;
