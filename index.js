import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import userRoutes from './route/userRoutes.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);  
app.use('/api/blogs', blogRoutes); 

app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on http://localhost:${PORT}`);
});
