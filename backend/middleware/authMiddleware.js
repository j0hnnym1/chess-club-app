const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Debug: Log the Authorization header
  console.log('Authorization Header:', req.header('Authorization'));

  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Split the 'Bearer' prefix and verify the token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug: Log decoded token
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Debug: Log token verification errors
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
