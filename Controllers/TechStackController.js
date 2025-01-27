import fs from 'fs';
import { TechStackModel } from "../Model/TechStackModel.js";
import { cloudinary } from "../utils/cloudinary.js";

// Helper function for uploading images to Cloudinary
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'nexile digital/techStacks' // Upload images to the 'techStacks' folder
        });
        fs.unlinkSync(filePath); // Delete the temp file after upload
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

// Controller function for adding a tech stack
export const addTechStack = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        console.log(req.body, req.file)

        // Upload image to Cloudinary
        const { url, public_id } = await uploadImage(req.file.path);

        // Create new tech stack entry
        const newTechStack = new TechStackModel({
            title: req.body.title,
            description: req.body.description,
            image: url,
            publicId: public_id
        });

        // Save to database
        await newTechStack.save();
        console.log(newTechStack)
        return res.status(201).json({ message: "Tech stack added successfully!", techStack: newTechStack });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Controller function for updating a tech stack
export const updateTechStack = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters

        // Find the existing tech stack entry
        const techStack = await TechStackModel.findById(id);
        if (!techStack) {
            return res.status(404).json({ message: "Tech stack not found." });
        }

        // Check if a new file is uploaded
        if (req.file) {
            // Upload the new image to Cloudinary
            const { url, public_id } = await uploadImage(req.file.path);

            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(techStack.publicId);

            // Update tech stack with new image data
            techStack.image = url;
            techStack.publicId = public_id;
        }

        // Update the other fields
        techStack.title = req.body.title || techStack.title; // Keep existing value if not provided
        techStack.description = req.body.description || techStack.description; // Keep existing value if not provided

        // Save updated tech stack to the database
        await techStack.save();
        return res.status(200).json({ message: "Tech stack updated successfully!", techStack });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// get tech stacks:
export const getTechStack = async (req, res) => {
    try{
        const techStack = await TechStackModel.find();
        res.status(200).json({ success: true, techStack });

    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Controller function for deleting a tech stack
export const deleteTechStack = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters

        // Find the tech stack entry to delete
        const techStack = await TechStackModel.findById(id);
        if (!techStack) {
            return res.status(404).json({ message: "Tech stack not found." });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(techStack.publicId);

        // Delete the tech stack entry from the database
        await TechStackModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Tech stack deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};