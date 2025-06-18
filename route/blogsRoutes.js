import express from 'express';
import { zodValidationMiddleware } from '../middleware/zodValidationMiddleware.js';
import {blogZodSchema} from '../schemas/blogSchema.js';
import {createBlog,getAllBlogs,getBlogById,updateBlog,deleteBlog,likeBlog,unlikeBlog,addComment,deleteComment ,getBlogsByUser  } from '../controller/Blog.js';
import upload from '../middleware/multerMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';      

const blogRouter = express.Router();


blogRouter.post('/create',authMiddleware,upload.single('image'),zodValidationMiddleware(blogZodSchema),createBlog);
blogRouter.get('/', getAllBlogs);
blogRouter.get('/user/:userId', getBlogsByUser);
blogRouter.get('/:id', getBlogById);
blogRouter.put('/:id', authMiddleware, upload.single('image'), zodValidationMiddleware(blogZodSchema), updateBlog);
blogRouter.delete('/:id', authMiddleware, deleteBlog);
blogRouter.post('/:id/like', authMiddleware, likeBlog);
blogRouter.post('/:id/unlike', authMiddleware, unlikeBlog);
blogRouter.post('/:id/comment', authMiddleware, addComment);
blogRouter.delete('/:id/comment/:commentId', authMiddleware, deleteComment);

export default blogRouter;
