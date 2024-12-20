const Player = require('../models/Player.js');

class PlayerDAO {
  static async findAll() {
    return await Player.find();
  }

  static async findById(id) {
    return await Player.findById(id);
  }

  static async create(data) {
    const player = new Player(data);
    return await player.save();
  }

  static async updateById(id, data) {
    return await Player.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteById(id) {
    return await Player.findByIdAndDelete(id);
  }
}

module.exports = PlayerDAO;
