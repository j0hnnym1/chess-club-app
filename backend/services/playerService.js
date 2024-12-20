const PlayerRepository = require('../repositories/PlayerRepository.js');
const PlayerDTO = require('../dto/PlayerDTO.js');

class PlayerService {
  static async getAllPlayers() {
    const players = await PlayerRepository.getAllPlayers();
    return players.map(player => new PlayerDTO(player));
  }

  static async getPlayerById(id) {
    const player = await PlayerRepository.getPlayerById(id);
    if (!player) throw new Error('Player not found');
    return new PlayerDTO(player);
  }

  static async createPlayer(data) {
    const player = await PlayerRepository.savePlayer(data);
    return new PlayerDTO(player);
  }

  static async updatePlayer(id, data) {
    const player = await PlayerRepository.updatePlayer(id, data);
    if (!player) throw new Error('Player not found');
    return new PlayerDTO(player);
  }

  static async deletePlayer(id) {
    const player = await PlayerRepository.deletePlayer(id);
    if (!player) throw new Error('Player not found');
    return { message: 'Player deleted' };
  }
}

module.exports = PlayerService;
