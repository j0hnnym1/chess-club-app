const ClubRepository = require('../repositories/ClubRepository.js');
const ClubDTO = require('../dto/ClubDTO.js');

class ClubService {
  static async getAllClubs() {
    const clubs = await ClubRepository.getAllClubs();
    return clubs.map(club => new ClubDTO(club));
  }

  static async getClubById(id) {
    const club = await ClubRepository.getClubById(id);
    if (!club) throw new Error('Club not found');
    return new ClubDTO(club);
  }

  static async createClub(data) {
    const club = await ClubRepository.saveClub(data);
    return new ClubDTO(club);
  }

  static async updateClub(id, data) {
    const club = await ClubRepository.updateClub(id, data);
    if (!club) throw new Error('Club not found');
    return new ClubDTO(club);
  }

  static async deleteClub(id) {
    const club = await ClubRepository.deleteClub(id);
    if (!club) throw new Error('Club not found');
    return { message: 'Club deleted' };
  }
}

module.exports = ClubService;
