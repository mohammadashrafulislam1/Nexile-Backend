import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js'; // Assuming you have a Cloudinary utility for configuration
import { BlogsModel } from '../Model/BlogsModel.js';

// Helper function for uploading images to Cloudinary
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'nexile digital/blogs' // Upload images to the 'blogs' folder
        });
        fs.unlinkSync(filePath); // Delete the temp file after upload
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new Error('Error uploading image');
    }
};


// Controller to add a new blog post
export const addBlog = async (req, res) => {
    try {
        const { title, category, description, metaTitle, metaDescription, tags } = req.body;
        let image = null;
        let public_id = null;

        // Check if an image file is uploaded
        if (req.file) {
            const uploadResult = await uploadImage(req.file.path);
            image = uploadResult.url;
            public_id = uploadResult.public_id;
        }

        // Create new blog post
        const newBlog = new BlogsModel({
            title,
            category,
            image,
            public_id,
            description,
            metaTitle,
            metaDescription,
            tags,
            created_at: new Date(), // Set the created_at field
        });

        // Save the blog post to the database
        await newBlog.save();

        res.status(201).json({ success: true, data: newBlog });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to update an existing blog post
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params; // Blog post ID
        const { title, category, description, metaTitle, metaDescription, tags } = req.body;
        let updatedImage = null;
        let updatedPublicId = null;

        // Find the blog post by ID
        const blogPost = await BlogsModel.findById(id);
        if (!blogPost) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // If a new image is uploaded, delete the old one and upload the new image
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (blogPost.public_id) {
                await cloudinary.uploader.destroy(blogPost.public_id);
            }

            // Upload the new image
            const uploadResult = await uploadImage(req.file.path);
            updatedImage = uploadResult.url;
            updatedPublicId = uploadResult.public_id;
        }

        // Update the blog post fields with new or existing data
        blogPost.title = title || blogPost.title;
        blogPost.category = category || blogPost.category;
        blogPost.description = description || blogPost.description;
        blogPost.metaTitle = metaTitle || blogPost.metaTitle;
        blogPost.metaDescription = metaDescription || blogPost.metaDescription;
        blogPost.tags = tags || blogPost.tags;
        blogPost.image = updatedImage || blogPost.image;
        blogPost.public_id = updatedPublicId || blogPost.public_id;

        // Save the updated blog post
        await blogPost.save();

        res.status(200).json({ success: true, data: blogPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all Team Members
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogsModel.find();
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Error fetching team members' });
    }
};

// get blog with name:
export const getBlogWithName = async (req, res) => {
    const { title } = req.params;
    
    try {
        // Search for a blog with the given title
        const findBlog = await BlogsModel.findOne({ title: title });

        // If no blog is found, return a 404 response
        if (!findBlog) {
            return res.status(404).json({message: 'Blog not found' });
        }

        // If the blog is found, return it in the response
        res.status(200).json({findBlog });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ success: false, message: 'Error fetching blog' });
    }
};

// Controller to delete a blog post
export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the blog post by ID
        const blogPost = await BlogsModel.findById(id);
        if (!blogPost) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // If the blog post has an associated image, delete it from Cloudinary
        if (blogPost.public_id) {
            await cloudinary.uploader.destroy(blogPost.public_id);
        }

        // Delete the blog post from the database
        await BlogsModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ success: false, message: 'Error deleting blog post' });
    }
};
