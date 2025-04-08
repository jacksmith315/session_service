const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sessionKey = `session:${decoded.sessionId}`;
    
    const session = await redisClient.get(sessionKey);
    if (!session) {
      return res.status(401).json({ message: 'Session expired' });
    }

    req.user = JSON.parse(session);
    req.sessionId = decoded.sessionId;
    
    // Extend session expiry
    await redisClient.expire(sessionKey, parseInt(process.env.SESSION_EXPIRY) / 1000);
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  verifyToken
};