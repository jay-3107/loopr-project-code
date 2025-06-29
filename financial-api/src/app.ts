import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes'; // Add this import
import exportRoutes from './routes/export.routes'; // Add this import

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to database
connectDatabase();

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Financial API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes); // Add dashboard routes
app.use('/api/export', exportRoutes); // Add export routes

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;