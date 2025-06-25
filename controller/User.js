import User from "../model/User.js";
import bcrypt from "bcrypt";    
import jwt from "jsonwebtoken";
 

//create user related controller functions  
export const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const loginUser = async (req, res) => {  
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
        
        // Exclude password from the returned user object
        const userToReturn = user.toObject();
        delete userToReturn.password;

        res.status(200).json({ token, user: userToReturn });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUserProfile = async (req, res) => {     
    try {
        const userId = req.user.id; 

        // Find user by ID
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const deleteUser = async (req, res) => {  
    try {
        const userId = req.user.id; 

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getAllUsers = async (req, res) => {  
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUserById = async (req, res) => {  
    try {
        const userId = req.params.id;

        // Find user by ID
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};







// --- Profile update controller ---
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username } = req.body;
        let updateData = {};

        if (username !== undefined) updateData.username = username;
        if (req.file) {
            updateData.profileImage = req.file.path; // This is the Cloudinary URL
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Failed to update profile" });
    }
};



