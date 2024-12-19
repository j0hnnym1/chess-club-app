const TournamentDAO = require('../dao/TournamentDAO.js');

class TournamentRepository {
  static async getAllTournaments() {
    return await TournamentDAO.findAll();
  }

  static async getTournamentById(id) {
    return await TournamentDAO.findById(id);
  }

  static async saveTournament(data) {
    return await TournamentDAO.create(data);
  }

  static async updateTournament(id, data) {
    return await TournamentDAO.updateById(id, data);
  }

  static async deleteTournament(id) {
    return await TournamentDAO.deleteById(id);
  }
}

module.exports = TournamentRepository;
