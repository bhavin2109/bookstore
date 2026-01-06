import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Check environment variables
console.log('🔍 Environment Configuration Check:');
console.log('  DB:', process.env.DB ? '✅ Set' : '❌ Missing');
console.log('  PORT:', process.env.PORT || '5000 (default)');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  RAZORPAY_KEY:', process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('  RAZORPAY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '✅ Set' : '❌ Missing');

// Connect to Database
connectDB();

//Import Routes
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chat.routes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
const httpServer = createServer(app);

// ... (CORS and Socket setup remains same) ...

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  // Do not log full headers in prod for security, maybe just specific ones or debug only
  // console.log('Headers:', req.headers); 
  next();
});

// Routes
app.use("/api/books", bookRoutes);
app.use('/api/admin/books', bookRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/chat', chatRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/delivery', deliveryRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});

