const ClubDAO = require('../dao/ClubDAO.js');

class ClubRepository {
  static async getAllClubs() {
    return await ClubDAO.findAll();
  }

  static async getClubById(id) {
    return await ClubDAO.findById(id);
  }

  static async saveClub(data) {
    return await ClubDAO.create(data);
  }

  static async updateClub(id, data) {
    return await ClubDAO.updateById(id, data);
  }

  static async deleteClub(id) {
    return await ClubDAO.deleteById(id);
  }
}

module.exports = ClubRepository;
