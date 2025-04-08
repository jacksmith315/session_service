const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { redisClient } = require('../config/redis');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Here you would typically validate credentials against your user database
    // This is a placeholder for demonstration
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const sessionId = uuidv4();
    const userData = {
      id: 1, // This would come from your user database
      email,
      roles: ['user'],
      sessionId
    };

    // Store session in Redis
    await redisClient.set(
      `session:${sessionId}`,
      JSON.stringify(userData),
      {
        EX: parseInt(process.env.SESSION_EXPIRY) / 1000
      }
    );

    // Generate JWT
    const token = jwt.sign(
      { sessionId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_EXPIRY / 1000 }
    );

    // Set cookie for web clients
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.SESSION_EXPIRY),
      sameSite: 'lax'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        email: userData.email,
        roles: userData.roles
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Remove session from Redis
    await redisClient.del(`session:${req.sessionId}`);
    
    // Clear cookie
    res.clearCookie('token');
    
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/verify', verifyToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

module.exports = router;