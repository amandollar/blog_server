import express from 'express';
import { zodValidationMiddleware } from '../middleware/zodValidationMiddleware';
import { blogSchema } from '../schemas/blogSchema';
import { createBlog, getBlog, updateBlog, deleteBlog, getAllBlogs } from '../controllers/blogController';
import upload from '../middleware/multerMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
// Import necessary modules and middleware      

const blogRoutes = express.Router();
// Route to create a new blog post  

blogRoutes.post(
    '/create',
    authMiddleware,
    upload.single('image'),
    zodValidationMiddleware(blogSchema.createBlogSchema),
    createBlog
);

// Route to get a single blog post by ID
blogRoutes.get('/:id', authMiddleware, getBlog);    

// Route to update a blog post by ID
blogRoutes.put(
    '/:id',
    authMiddleware,
    upload.single('image'),
    zodValidationMiddleware(blogSchema.updateBlogSchema),
    updateBlog
);

// Route to delete a blog post by ID
blogRoutes.delete('/:id', authMiddleware, deleteBlog);  

// Route to get all blog posts
blogRoutes.get('/', authMiddleware, getAllBlogs);   

// Export the blog routes
export default blogRoutes;
