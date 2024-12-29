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

  static async deleteTournament(req, res) {
    try {
      const { id } = req.params;
      console.log('Received request to delete tournament with ID:', id); // Debugging
  
      // Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.warn('Invalid tournament ID:', id); // Debugging
        return res.status(400).json({ error: 'Invalid tournament ID' });
      }
  
      // Attempt to delete the tournament
      const deletedTournament = await Tournament.findByIdAndDelete(id);
      if (!deletedTournament) {
        console.warn('Tournament not found for deletion with ID:', id); // Debugging
        return res.status(404).json({ error: 'Tournament not found' });
      }
  
      console.log('Tournament deleted successfully:', deletedTournament); // Debugging
      return res.status(200).json({ message: 'Tournament deleted successfully' });
    } catch (err) {
      console.error('Error deleting tournament:', err.message, err.stack); // Debugging
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = TournamentService;
