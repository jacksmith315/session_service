const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { redisClient } = require('./redis');

const sessionConfig = {
  store: new RedisStore({ 
    client: redisClient,
    prefix: 'session:',
  }),
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_EXPIRY),
    sameSite: 'lax'
  }
};

module.exports = session(sessionConfig);