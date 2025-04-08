require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { connectRedis } = require('./config/redis');
const sessionMiddleware = require('./config/session');
const rateLimiter = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/session');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis
connectRedis();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(rateLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/session', sessionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Session service running on port ${PORT}`);
});