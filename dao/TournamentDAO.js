const Tournament = require('../models/Tournament.js');

class TournamentDAO {
  static async findAll() {
    return await Tournament.find().populate('hostId').populate('players');
  }

  static async findById(id) {
    return await Tournament.findById(id).populate('hostId').populate('players');
  }

  static async create(data) {
    const tournament = new Tournament(data);
    return await tournament.save();
  }

  static async updateById(id, data) {
    return await Tournament.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteById(id) {
    return await Tournament.findByIdAndDelete(id);
  }
}

module.exports = TournamentDAO;
