const Club = require('../models/Club');

class ClubRepository {
  static async getAllClubs() {
    return await Club.find(); // Retrieve all clubs
  }

  static async getClubById(id) {
    return await Club.findById(id); // Retrieve club by ID
  }

  static async saveClub(data) {
    return await Club.create(data); // Save a new club
  }

  static async updateClub(id, data) {
    return await Club.findByIdAndUpdate(id, data, { new: true }); // Update club
  }

  static async deleteClub(id) {
    return await Club.findByIdAndDelete(id); // Delete club
  }
}

module.exports = ClubRepository;
