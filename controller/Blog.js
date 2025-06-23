import Blog from "../model/Blog.js";

// Create a new blog
export const createBlog = async (req, res) => {
   
    console.log("Creating blog with user:", req.user);
    
    try {
        const { title, content, tags } = req.body;
        const imageFile = req.file;
        const newBlog = new Blog({
            title,
            content,
            image: imageFile ? imageFile.path : "",
            author: req.user.id,
            likes: [],
            tags
        });

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "username email")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("author", "username email")
            .lean();

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update a blog
export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, content, tags } = req.body;
        const imageFile = req.file;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this blog" });
        }

        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        blog.image = imageFile ? imageFile.path : blog.image;

        await blog.save();

        const updatedBlog = await Blog.findById(blogId).populate("author", "username email");

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a blog
// Delete a blog
export const deleteBlog = async (req, res) => {
    try {
        
     


        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this blog" });
        }

        await Blog.findByIdAndDelete(req.params.id); // ✅ Replaced .remove()

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Like a blog
export const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const userId = req.user.id;
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

// Unlike a blog
export const unlikeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const userId = req.user.id;
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

// Add a comment to a blog
export const addComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const comment = {
            user: req.user.id,
            content: req.body.content,
            createdAt: new Date()
        };

        blog.comments.push(comment);
        await blog.save();

        res.status(200).json({ message: "Comment added successfully", comments: blog.comments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a comment from a blog
export const deleteComment = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const commentId = req.params.commentId;
        const userId = req.user.id;

        const commentIndex = blog.comments.findIndex(
            comment => comment._id.toString() === commentId && comment.user.toString() === userId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: "Comment not found or not authorized" });
        }

        blog.comments.splice(commentIndex, 1);
        await blog.save();

        res.status(200).json({ message: "Comment deleted successfully", comments: blog.comments });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get blogs by a specific user
export const getBlogsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const blogs = await Blog.find({ author: userId })
            .populate("author", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
