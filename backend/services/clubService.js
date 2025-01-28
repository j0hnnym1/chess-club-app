const ClubRepository = require('../repositories/ClubRepository.js');
const ClubDTO = require('../dto/ClubDTO.js');

class ClubService {
  static async getAllClubs() {
    console.log('ClubService.getAllClubs called'); // Debugging
    const clubs = await ClubRepository.getAllClubs();
    return clubs.map(club => new ClubDTO(club));
  }

  static async getClubById(id) {
    console.log(`ClubService.getClubById called with ID: ${id}`); // Debugging
    const club = await ClubRepository.getClubById(id);
    if (!club) throw new Error('Club not found');
    return new ClubDTO(club);
  }

  static async createClub(data) {
    console.log('ClubService.createClub called with data:', data); // Debugging
    if (!data.name || !data.location) {
      throw new Error('Name and location are required');
    }

    const club = await ClubRepository.saveClub(data);
    return new ClubDTO(club);
  }

  static async updateClub(id, data) {
    console.log(`ClubService.updateClub called with ID: ${id} and data:`, data); // Debugging
    const club = await ClubRepository.updateClub(id, data);
    if (!club) throw new Error('Club not found');
    return new ClubDTO(club);
  }

  static async deleteClub(id) {
    console.log(`ClubService.deleteClub called with ID: ${id}`); // Debugging
    const club = await ClubRepository.deleteClub(id);
    if (!club) throw new Error('Club not found');
    return { message: 'Club deleted' };
  }
}

module.exports = ClubService;
