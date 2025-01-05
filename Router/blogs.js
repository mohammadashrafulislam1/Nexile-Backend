import express from "express";
import { upload } from "../Middleware/multer.js";
import { addBlog, deleteBlog, getAllBlogs, getBlogWithName, updateBlog } from "../Controllers/BlogsController.js";

export const blogsRouter = express.Router();

// Route to add a new blog post (with image upload)
blogsRouter.post('/', upload.single('image'), addBlog);

// Route to update an existing blog post (with image upload)
blogsRouter.put('/:id', upload.single('image'), updateBlog);

// get all blogs:
blogsRouter.get('/', getAllBlogs)

// get blog with name:
blogsRouter.get('/:title', getBlogWithName)

// delete blog router:
blogsRouter.delete('/:id', deleteBlog);
