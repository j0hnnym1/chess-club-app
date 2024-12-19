const Club = require('../models/Club.js');

class ClubDAO {
  static async findAll() {
    return await Club.find();
  }

  static async findById(id) {
    return await Club.findById(id);
  }

  static async create(data) {
    const club = new Club(data);
    return await club.save();
  }

  static async updateById(id, data) {
    return await Club.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteById(id) {
    return await Club.findByIdAndDelete(id);
  }
}

module.exports = ClubDAO;
