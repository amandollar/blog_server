import mongoose from "mongoose";
import Blog from "./Blog.js"; 


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);


userSchema.pre("remove", async function (next) {
  await Blog.deleteMany({ author: this._id });
  next();
});


export default User;