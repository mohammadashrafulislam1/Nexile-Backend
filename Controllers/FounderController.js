import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { FounderModel } from '../Model/FounderModel.js';

// Add Founder
export const addFounder = async (req, res) => {
    try {
        const { title, des, year, satisfaction, completedPersonally, website, experience, founderName } = req.body;

        // Ensure all required fields are present
        if (!title || !des || !year || !satisfaction || !completedPersonally || !website || !experience || !founderName || !req.file) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Upload image to Cloudinary with folder specification
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'nexile digital/founders' // Specify folder for founder images
        });
        
        // Create a new founder entry
        const newFounder = new FounderModel({
            title,
            des,
            year,
            satisfaction,
            completedPersonally,
            website,
            experience,
            founderName,
            founderImage: result.secure_url, // Cloudinary URL
            publicId: result.public_id // Cloudinary public ID for later deletion
        });

        // Save the founder to the database
        await newFounder.save();

        // Remove the temporary file
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: "Founder added successfully!", founder: newFounder });
    } catch (error) {
        res.status(500).json({ message: "Failed to add founder", error: error.message });
    }
};

// Update Founder
export const updateFounder = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, des, year, satisfaction, completedPersonally, website, experience, founderName } = req.body;

        // Find the founder by ID
        const founder = await FounderModel.findById(id);
        if (!founder) {
            return res.status(404).json({ message: "Founder not found." });
        }

        let updatedData = {
            title,
            des,
            year,
            satisfaction,
            completedPersonally,
            website,
            experience,
            founderName
        };

        // If a new image is uploaded, handle Cloudinary upload
        if (req.file) {
            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(founder.publicId);

            // Upload the new image to Cloudinary with folder specification
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'nexile digital/founders' // Specify folder for founder images
            });
            updatedData.founderImage = result.secure_url; // Update image URL
            updatedData.publicId = result.public_id; // Update public ID
        }

        // Update the founder entry
        const updatedFounder = await FounderModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        // Remove the temporary file
        fs.unlinkSync(req.file.path);
        
        res.status(200).json({ message: "Founder updated successfully!", founder: updatedFounder });
    } catch (error) {
        res.status(500).json({ message: "Failed to update founder", error: error.message });
    }
};


// Get all services
export const getAllFounder = async (req, res) => {
    try {
      const founder = await FounderModel.find();
      res.status(200).json(founder);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Error fetching services' });
    }
  };
