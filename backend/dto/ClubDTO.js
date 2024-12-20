class ClubDTO {
    constructor(club) {
      this.id = club._id;
      this.name = club.name;
      this.location = club.location;
    }
  }
  
  module.exports = ClubDTO;
  