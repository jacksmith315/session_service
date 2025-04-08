const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { redisClient } = require('../config/redis');

const router = express.Router();

router.get('/status', verifyToken, async (req, res) => {
  try {
    const sessions = await redisClient.keys('session:*');
    res.json({
      activeSessions: sessions.length,
      currentSession: {
        id: req.sessionId,
        user: req.user
      }
    });
  } catch (error) {
    console.error('Session status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/extend', verifyToken, async (req, res) => {
  try {
    await redisClient.expire(
      `session:${req.sessionId}`,
      parseInt(process.env.SESSION_EXPIRY) / 1000
    );
    res.json({ message: 'Session extended successfully' });
  } catch (error) {
    console.error('Session extension error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/invalidate-all', verifyToken, async (req, res) => {
  try {
    const sessions = await redisClient.keys('session:*');
    if (sessions.length > 0) {
      await redisClient.del(sessions);
    }
    res.json({ message: 'All sessions invalidated successfully' });
  } catch (error) {
    console.error('Session invalidation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;