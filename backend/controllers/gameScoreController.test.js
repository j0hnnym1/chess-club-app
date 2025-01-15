const GameScoreController = require('../controllers/gameScoreController');
const GameScore = require('../models/GameScore');
const Player = require('../models/Player');
const mongoose = require('mongoose');

// Mock the models
jest.mock('../models/GameScore');
jest.mock('../models/Player');

describe('GameScoreController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateGameResult', () => {
    test('should update game result and player ratings successfully', async () => {
      // Setup mock data
      const mockGame = {
        _id: new mongoose.Types.ObjectId(),
        player1Id: new mongoose.Types.ObjectId(),
        player2Id: new mongoose.Types.ObjectId(),
        save: jest.fn().mockResolvedValue(true)
      };

      const mockPlayer1 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06,
        save: jest.fn().mockResolvedValue(true)
      };

      const mockPlayer2 = {
        rating: 1500,
        ratingDeviation: 350,
        volatility: 0.06,
        save: jest.fn().mockResolvedValue(true)
      };

      // Setup mocks
      GameScore.findById = jest.fn().mockResolvedValue(mockGame);
      Player.findById = jest.fn()
        .mockResolvedValueOnce(mockPlayer1)
        .mockResolvedValueOnce(mockPlayer2);

      // Setup request
      req.body = {
        gameId: mockGame._id.toString(),
        result: 'Player1'
      };

      // Execute
      await GameScoreController.updateGameResult(req, res);

      // Assert
      expect(GameScore.findById).toHaveBeenCalledWith(mockGame._id.toString());
      expect(Player.findById).toHaveBeenCalledWith(mockGame.player1Id);
      expect(Player.findById).toHaveBeenCalledWith(mockGame.player2Id);
      expect(mockPlayer1.save).toHaveBeenCalled();
      expect(mockPlayer2.save).toHaveBeenCalled();
      expect(mockGame.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    test('should handle game not found', async () => {
      GameScore.findById = jest.fn().mockResolvedValue(null);

      req.body = {
        gameId: new mongoose.Types.ObjectId().toString(),
        result: 'Player1'
      };

      await GameScoreController.updateGameResult(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Game not found' });
    });

    test('should handle player not found', async () => {
      const mockGame = {
        _id: new mongoose.Types.ObjectId(),
        player1Id: new mongoose.Types.ObjectId(),
        player2Id: new mongoose.Types.ObjectId()
      };

      GameScore.findById = jest.fn().mockResolvedValue(mockGame);
      Player.findById = jest.fn().mockResolvedValue(null);

      req.body = {
        gameId: mockGame._id.toString(),
        result: 'Player1'
      };

      await GameScoreController.updateGameResult(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Players not found' });
    });

    test('should handle database errors', async () => {
      GameScore.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      req.body = {
        gameId: new mongoose.Types.ObjectId().toString(),
        result: 'Player1'
      };

      await GameScoreController.updateGameResult(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});