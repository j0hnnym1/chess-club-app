const PlayerDAO = require('../dao/PlayerDAO.js');

class PlayerRepository {
  static async getAllPlayers() {
    return await PlayerDAO.findAll();
  }

  static async getPlayerById(id) {
    return await PlayerDAO.findById(id);
  }

  static async savePlayer(data) {
    return await PlayerDAO.create(data);
  }

  static async updatePlayer(id, data) {
    return await PlayerDAO.updateById(id, data);
  }

  static async deletePlayer(id) {
    return await PlayerDAO.deleteById(id);
  }
}

module.exports = PlayerRepository;
