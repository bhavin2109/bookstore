import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import Products from './models/Products.js';

// Check environment variables
console.log('🔍 Environment Configuration Check:');
console.log('  DB:', process.env.DB ? '✅ Set' : '❌ Missing');
console.log('  PORT:', process.env.PORT || '5000 (default)');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');

// Connect to Database
connectDB();

//Import Routes
import authRoutes from './routes/user.js';
import productRoutes from './routes/productRoutes.js';

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://nerdyenough.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api/products", productRoutes);

app.use('/api/admin/products', productRoutes);



// use Routes

app.use('/api/user', authRoutes);



const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Force restart for env vars to load
// Updated: 2025-12-27

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});

