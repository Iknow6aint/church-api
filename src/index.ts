/**
 * @fileoverview Main application file with custom error handling
 * @module index
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import logger from './config/winston';
import { BaseError } from './errors/baseError';

import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import attendanceRoutes from './routes/attendanceRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Database connection
logger.info('Connecting to MongoDB');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/church-app')
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error: Error) => {
  logger.error('MongoDB connection error', { error: error.message });
  process.exit(1);
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);
app.use('/attendance', attendanceRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Uncaught error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body
  });
  
  if (err instanceof BaseError) {
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  res.status(500).json({ 
    status: 'error',
    code: 500,
    message: 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info('Server started', { port: PORT });
  logger.info('API documentation available at http://localhost:%d/api-docs', PORT);
});
