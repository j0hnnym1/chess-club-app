const TournamentRepository = require('../repositories/TournamentRepository.js');
const TournamentDTO = require('../dto/TournamentDTO.js');

class TournamentService {
  static async getAllTournaments() {
    const tournaments = await TournamentRepository.getAllTournaments();
    return tournaments.map(tournament => new TournamentDTO(tournament));
  }

  static async getTournamentById(id) {
    const tournament = await TournamentRepository.getTournamentById(id);
    if (!tournament) throw new Error('Tournament not found');
    return new TournamentDTO(tournament);
  }

  static async createTournament(data) {
    const tournament = await TournamentRepository.saveTournament(data);
    return new TournamentDTO(tournament);
  }

  static async updateTournament(id, data) {
    const tournament = await TournamentRepository.updateTournament(id, data);
    if (!tournament) throw new Error('Tournament not found');
    return new TournamentDTO(tournament);
  }

  static async deleteTournament(id) {
    const tournament = await TournamentRepository.deleteTournament(id);
    if (!tournament) throw new Error('Tournament not found');
    return { message: 'Tournament deleted' };
  }
}

module.exports = TournamentService;
