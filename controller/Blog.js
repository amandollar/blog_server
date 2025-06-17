import Blog  from "../model/Blog";


//write all the controller functions related to blog
export const createBlog = async (req, res) => {
    try {
        const { title, content, image, tags } = req.body;
        const author = req.user.id; // Assuming user ID is stored in req.user

        const newBlog = new Blog({
            title,
            content,
            image,
            author,
            tags
        });

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};  

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("author", "username email").sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate("author", "username email");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, content, image, tags } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, content, image, tags },
            { new: true }
        ).populate("author", "username email");

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }   
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has already liked the blog
        if (blog.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this blog" });
        }

        blog.likes.push(userId);
        await blog.save();

        res.status(200).json({ message: "Blog liked successfully", likes: blog.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const unlikeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Check if the user has liked the blog
        if (!blog.likes.includes(userId)) {
            return res.status(400).json({ message: "You have not liked this blog" });
        }

        blog.likes = blog.likes.filter(id => id.toString() !== userId);
        await blog.save();

        res.status(200).json({ message: "Blog unliked successfully", likes: blog.likes.length });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const addComment = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { content } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in req.user

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const comment = {
            user: userId,
            content,
            createdAt: new Date()
        };

        blog.comments.push(comment);
        await blog.save();

        res.status(200).json({ message: "Comment added successfully", comments: blog.comments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { commentId } = req.body; // Assuming comment ID is sent in the request body
        const userId = req.user.id; // Assuming user ID is stored in req.user

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Find the comment to delete
        const commentIndex = blog.comments.findIndex(comment => comment._id.toString() === commentId && comment.user.toString() === userId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found or you do not have permission to delete it" });
        }

        blog.comments.splice(commentIndex, 1);
        await blog.save();

        res.status(200).json({ message: "Comment deleted successfully", comments: blog.comments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getBlogsByUser = async (req, res) => {
    try {
        const userId = req.user.id; 

        const blogs = await Blog.find({ author: userId }).populate("author", "username email").sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};





