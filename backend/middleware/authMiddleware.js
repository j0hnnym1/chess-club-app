const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  console.log('Authorization Header:', req.header('Authorization')); // Debug: Log header

  const token = req.header('Authorization');
  if (!token) {
    console.error('No token provided'); // Debug: Log missing token
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Debug split token
    console.log('Decoded Token:', decoded); // Debug: Log decoded token
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Debug: Log token error
    return res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
