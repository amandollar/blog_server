import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './route/userRoutes.js';
import blogRouter from './route/blogsRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Correct CORS config for credentials
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins dynamically
  },
  credentials: true
}));

// Routes
app.use('/api/users', userRouter);  
app.use('/api/blogs', blogRouter); 

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
