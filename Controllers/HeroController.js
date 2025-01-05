
import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { HeroModel } from '../Model/HeroModel.js';

// Add a new hero with logo upload
export const addHero = async (req, res) => {
  try {
    // Check if a file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'No logo uploaded' });
    }
    console.log(req.body)
// Ensure `menu` is an array of objects
if (!Array.isArray(req.body.menu)) {
  return res.status(400).json({ error: "Menu must be an array of objects." });
}
    // Upload logo to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nexile digital/hero', 
    });

    // Delete the file from the local server after upload
    fs.unlinkSync(req.file.path);

    // Create a new hero record with the Cloudinary logo URL
    const newHero = new HeroModel({
      logo: result.secure_url, 
      imagePublicId:result.public_id,
      menu: req.body.menu,
      title: req.body.title,
      description: req.body.description,
      googleReview: req.body.googleReview,
      nexileReview: req.body.nexileReview,
      clients: req.body.clients,
      experience: req.body.experience,
    });

    // Save hero to the database
    const savedHero = await newHero.save();
    res.status(201).json(savedHero);

  } catch (error) {
    console.error('Error adding hero:', error);
    res.status(500).json({ message: 'Error adding hero' });
  }
};

// Update hero with id
export const updateHero = async (req, res) => {
    try {
      const { id } = req.params; // Get hero ID from request parameters
  
      // Find the hero by ID
      const existingHero = await HeroModel.findById(id);
      if (!existingHero) {
        return res.status(404).json({ message: 'Hero not found' });
      }
  
      // Prepare updated data
      const updatedData = {
        title: req.body.title || existingHero.title,
        menu: req.body.menu || existingHero.menu,
        description: req.body.description || existingHero.description,
        googleReview: req.body.googleReview || existingHero.googleReview,
        nexileReview: req.body.nexileReview || existingHero.nexileReview,
        clients: req.body.clients || existingHero.clients,
        experience: req.body.experience || existingHero.experience,
      };
  
      // If a new logo is provided, upload it
      if (req.file) {
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(existingHero.imagePublicId); // Ensure you have this field in your schema
        // Upload new logo to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'nexile digital/hero', // Cloudinary folder
        });
        updatedData.logo = result.secure_url; // Update the logo with new URL
        updatedData.imagePublicId = result.public_id; // Store the public ID for future deletions
      }
  
      // Update hero in the database
      const updatedHero = await HeroModel.findByIdAndUpdate(id, updatedData, { new: true });
      res.status(200).json(updatedHero);
    } catch (error) {
      console.error('Error updating hero:', error);
      res.status(500).json({ message: 'Error updating hero' });
    }
  };

// Get all heroes
export const getHeros = async (req, res) => { 
    try {
      // Retrieve all heroes from the database
      const heroes = await HeroModel.find();
  
      // Return the list of heroes
      res.status(200).json(heroes);
    } catch (error) {
      console.error('Error retrieving heroes:', error);
      res.status(500).json({ message: 'Error retrieving heroes' });
    }
  };

// Delete hero with id
export const deleteHero = async (req, res) => {
    try {
      const { id } = req.params; // Get hero ID from request parameters
  
      // Find the hero by ID
      const existingHero = await HeroModel.findById(id);
      if (!existingHero) {
        return res.status(404).json({ message: 'Hero not found' });
      }
  
      // Delete the logo from Cloudinary
      await cloudinary.uploader.destroy(existingHero.imagePublicId); // Ensure you have this field in your schema
  
      // Delete the hero from the database
      await HeroModel.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Hero deleted successfully' });
    } catch (error) {
      console.error('Error deleting hero:', error);
      res.status(500).json({ message: 'Error deleting hero' });
    }
  };
