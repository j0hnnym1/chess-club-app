class PlayerDTO {
    constructor(player) {
      this.id = player._id;
      this.name = player.name;
      this.age = player.age;
      this.role = player.role;
      this.clubId = player.clubId;
      this.rating = player.rating;
    }
  }
  
  module.exports = PlayerDTO;
  