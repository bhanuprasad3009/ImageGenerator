import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configuration
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Routers
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';
import imageRoutes from './routes/images.js';
import stripeRoutes from './routes/stripe.js';
import adminRoutes from './routes/admin.js';
import toolsRoutes from './routes/tools.js';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Establish DB Connection
connectDB();

// 2. Pre-create public and generation directories
const publicDir = path.join(__dirname, 'public');
const genDir = path.join(publicDir, 'generations');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(genDir)) fs.mkdirSync(genDir, { recursive: true });

// 3. Middlewares
// Apply standard CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger
app.use(morgan('dev'));

// Static Folders
app.use('/generations', express.static(genDir));

// JSON Parser (Webhook requires raw bodies, handled inside route, so standard route gets normal express.json)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    next();
  } else {
    express.json({ limit: '10mb' })(req, res, next);
  }
});

// 4. API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tools', toolsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'AetherArt API is active and running', timestamp: new Date() });
});

// 5. Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server launched successfully in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
