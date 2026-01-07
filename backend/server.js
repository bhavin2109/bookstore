import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

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
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
const httpServer = createServer(app);

// CORS configuration - allow all origins in production for Vercel
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://nerdyenough.vercel.app", // Vercel deployment
      "https://bookstore-rnnf.onrender.com", // Render deployment
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
};

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket Auth Middleware
io.use(async (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    try {
      const token = socket.handshake.query.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.log('Socket Auth Error:', error.message);
      // Don't block connection for now to allow public tracking if needed,
      // but strict apps would block next(new Error('Authentication error'));
      next();
    }
  } else {
    next();
  }
});

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  if (socket.user) {
    socket.join(socket.user._id.toString());
    console.log(`User ${socket.user.name} joined room ${socket.user._id}`);
    socket.emit("connected");
  }

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log(`User joined Chat Room: ${room}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing"));

  socket.on("new_message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message_received", newMessageReceived);
      // Also emit notification
      io.to(user._id).emit("notification", {
        type: 'new_message',
        message: `New message from ${newMessageReceived.sender.name}`,
        relatedId: chat._id
      });
    });
  });

  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`User/Partner joined order room: ${orderId}`);
  });

  socket.on("location_update", (data) => {
    // data: { orderId, location: { lat, lng } }
    io.to(data.orderId).emit("location_update", data.location);
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
});


app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Inject Socket.io into request
app.use((req, res, next) => {
  req.io = io;
  next();
});

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
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

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
