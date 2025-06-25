import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './route/userRoutes.js';
import blogRouter from './route/blogsRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {

  origin: ['http://localhost:5173', 'https://your-production-frontend-url.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
};


app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRouter);  
app.use('/api/blogs', blogRouter); 
app.use('/user', userRouter);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
