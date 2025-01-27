import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { HowWeWorkModel } from '../Model/HowWeWorkModel.js';

// Controller for adding new "how we work" entry
export const addHowWeWork = async (req, res) => {
  try {
    let thumbnailUrl = '';
    let publicId = '';

    console.log("req.body", req.body)
    console.log("req.file", req.file)
    console.log("req.files", req.files)

    // Upload the thumbnail image to Cloudinary thumbnail
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
          folder: 'nexile digital/how-we-work',
        });
        thumbnailUrl = result.secure_url;
        publicId = result.public_id;

        // Remove the local file after successful upload
        try {
          fs.unlinkSync(req.files.thumbnail[0].path);
        } catch (unlinkError) {
          console.error("Error removing local file:", unlinkError);
        }
      } catch (error) {
        return res.status(500).json({ message: 'Error uploading thumbnail image' });
      }
    }

    // Create new entry with uploaded images
    const newHowWeWork = new HowWeWorkModel({
      video: req.body.video,
      thumbnail: thumbnailUrl,
      publicId,
      title: req.body.title,
      color: req.body.color,
      description: req.body.description,
    });

    // Save the entry to the database
    const savedEntry = await newHowWeWork.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    console.error('Error adding how we work entry:', error);
    res.status(500).json({ message: 'Error adding how we work entry' });
  }
};

// Helper function for deleting images from Cloudinary
const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Error deleting image:', error.message);
  }
};

// Controller for updating an existing "how we work" entry
export const updateHowWeWork = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID of the entry to update
    const existingEntry = await HowWeWorkModel.findById(id);

    if (!existingEntry) {
      return res.status(404).json({ message: 'HowWeWork entry not found' });
    }

    let thumbnailUrl = existingEntry.thumbnail;
    let publicId = existingEntry.publicId;

    // Update thumbnail image if a new one is uploaded
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      await deleteImage(existingEntry.publicId);

      try {
        const result = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
          folder: 'nexile digital/how-we-work',
        });
        thumbnailUrl = result.secure_url;
        publicId = result.public_id;

        // Remove the local file after successful upload
        try {
          fs.unlinkSync(req.files.thumbnail[0].path);
        } catch (unlinkError) {
          console.error("Error removing local file:", unlinkError);
        }
      } catch (error) {
        return res.status(500).json({ message: 'Error uploading new thumbnail image' });
      }
    }

    // Update the entry with new data (or keep the same if no changes)
    existingEntry.video = req.body.video || existingEntry.video;
    existingEntry.thumbnail = thumbnailUrl;
    existingEntry.publicId = publicId;
    existingEntry.title = req.body.title || existingEntry.title;
    existingEntry.description = req.body.description || existingEntry.description;
    existingEntry.color = req.body.color || existingEntry.color;

    // Save the updated entry
    const updatedEntry = await existingEntry.save();
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error('Error updating how we work entry:', error);
    res.status(500).json({ message: 'Error updating how we work entry' });
  }
};


export const getHowWeWork = async(req,res)=>{
    try{
     const howweworks = await HowWeWorkModel.find();
     res.status(200).json(howweworks);
    }
    catch (error) {
        console.error('Error updating how we work entry:', error);
        res.status(500).json({ message: 'Error updating how we work entry' });
      }
}