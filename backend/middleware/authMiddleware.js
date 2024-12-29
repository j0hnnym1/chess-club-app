const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  console.log('Authorization Header:', req.header('Authorization')); // Debugging

  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    console.error('No token provided'); // Debugging
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token
    console.log('Decoded Token:', decoded); // Debugging
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Debugging
    return res.status(403).json({ msg: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
