const GameScore = require('../models/GameScore.js');

class GameScoreDAO {
  static async findAll() {
    return await GameScore.find()
      .populate('tournamentId')
      .populate('player1Id')
      .populate('player2Id')
      .populate('winnerId');
  }

  static async findById(id) {
    return await GameScore.findById(id)
      .populate('tournamentId')
      .populate('player1Id')
      .populate('player2Id')
      .populate('winnerId');
  }

  static async create(data) {
    const gameScore = new GameScore(data);
    return await gameScore.save();
  }

  static async updateById(id, data) {
    return await GameScore.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteById(id) {
    return await GameScore.findByIdAndDelete(id);
  }
}

module.exports = GameScoreDAO;
