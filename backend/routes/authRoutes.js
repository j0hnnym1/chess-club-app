const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Debug: Log incoming request body
    console.log('Register Request Body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Debug: Log validation errors
      console.error('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        // Debug: User already exists
        console.error('User already exists:', email);
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        email,
        password,
        role,
      });

      // Hash the password

      //Dubugging
      console.log('Password before hashing:', password); // Log the plain password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      console.log('Hashed Password:', user.password); // Log the hashed password

      // Debug: Log hashed password
      console.log('Hashed Password:', user.password);

      await user.save();

      // Generate JWT
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Debug: Log generated token
      console.log('Generated Token:', token);

      res.status(201).json({ token });
    } catch (err) {
      // Debug: Log server error
      console.error('Server Error during registration:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login a user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Debug: Log incoming request body
    console.log('Login Request Body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Debug: Log validation errors
      console.error('Validation Errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Debug: Log invalid email
        console.error('Invalid Email:', email);
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Debug: Log retrieved user from database
      console.log('Retrieved User:', user);

      const isMatch = await bcrypt.compare(password, user.password);

      // Debug: Log password comparison result
      console.log('Password Match:', isMatch);

      if (!isMatch) {
        // Debug: Log invalid password
        console.error('Invalid Password for email:', email);
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

      // Debug: Log generated token
      console.log('Generated Token:', token);

      res.json({ token });
    } catch (err) {
      // Debug: Log server error
      console.error('Server Error during login:', err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newToken = jwt.sign({ user: decoded.user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (err) {
    console.error('Refresh token failed:', err.message);
    res.status(403).json({ msg: 'Invalid refresh token' });
  }
});

module.exports = router;
