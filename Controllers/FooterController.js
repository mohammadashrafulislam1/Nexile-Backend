import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { FooterModel } from '../Model/FooterModel.js';

// Helper function for uploading images
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'nexile digital/footer' // Upload images to the 'footer' folder
        });
        fs.unlinkSync(filePath); // Delete temp file
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

// Controller to add a new footer entry
export const addFooter = async (req, res) => {
    try {
        const { footerData } = req.body;

        // Parse footerData if it is a JSON string
        const parsedFooterData = typeof footerData === 'string' ? JSON.parse(footerData) : footerData;

        const {
            company,
            services,
            resources,
            followUs,
            contactMessage,
            copyright
        } = parsedFooterData;

        let logo = null;
        let public_id = null;

        console.log("Parsed Footer Data:", parsedFooterData);
        console.log("Uploaded File:", req.file);

        // Check if a logo file is uploaded
        if (req.file) {
            const uploadResult = await uploadImage(req.file.path);
            logo = uploadResult.url;
            public_id = uploadResult.public_id;

            console.log("Upload Result:", uploadResult); // Log upload result
        }

        // Create a new footer entry
        const newFooter = new FooterModel({
            company,
            logo,        // Save the uploaded logo URL
            public_id,    // Save the uploaded logo public ID
            services,
            resources,
            followUs,
            contactMessage,
            copyright
        });

        // Save the footer entry to the database
        await newFooter.save();
        console.log(newFooter)

        res.status(201).json({ success: true, data: newFooter });
    } catch (error) {
        console.error("Error in addFooter:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to update an existing footer entry
export const updateFooter = async (req, res) => {
    try {
        const { id } = req.params; // Footer entry ID
        const { footerData } = req.body; // Get footerData from the request body
        console.log("Incoming request body:", req.body);

        // Parse footerData if it is a JSON string
        const parsedFooterData = typeof footerData === 'string' ? JSON.parse(footerData) : footerData;

        const {
            company,
            services,
            resources,
            followUs,
            contactMessage,
            copyright
        } = parsedFooterData;

        // Find the footer entry by ID
        const footerEntry = await FooterModel.findById(id);
        if (!footerEntry) {
            return res.status(404).json({ success: false, message: 'Footer entry not found' });
        }
        console.log("footerEntry", footerEntry);

        let updatedLogo = footerEntry.logo; // Keep the existing logo if no new image is uploaded

        // If a new logo file is uploaded, delete the old one and upload the new image
        if (req.file) {
            // Delete the old logo from Cloudinary if it exists
            if (footerEntry.public_id) {
                await cloudinary.uploader.destroy(footerEntry.public_id);
            }

            // Upload the new logo
            const uploadResult = await uploadImage(req.file.path);
            updatedLogo = uploadResult.url; // Update the logo URL
            footerEntry.public_id = uploadResult.public_id; // Update the public ID
        }

        // Update footer entry fields with new or existing data
        footerEntry.company = company ?? footerEntry.company;
        footerEntry.services = services ?? footerEntry.services;
        footerEntry.resources = resources ?? footerEntry.resources;
        footerEntry.followUs = followUs ?? footerEntry.followUs;
        footerEntry.contactMessage = contactMessage ?? footerEntry.contactMessage;
        footerEntry.copyright = copyright ?? footerEntry.copyright;
        footerEntry.logo = updatedLogo; // Update logo

        // Save the updated footer entry
        await footerEntry.save();
        console.log(footerEntry);

        res.status(200).json({ success: true, data: footerEntry });
    } catch (error) {
        console.error("Error in updateFooter:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// get all footer: 
export const getFooter = async (req, res) => {
    try{
     const footer = await FooterModel.find()
     res.status(200).json({ success: true, footer});
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Controller to get an existing footer entry by ID
export const getFooterById = async (req, res) => {
    try {
        const { id } = req.params; // Footer entry ID
        
        // Find the footer entry by ID
        const footerEntry = await FooterModel.findById(id);
        if (!footerEntry) {
            return res.status(404).json({ success: false, message: 'Footer entry not found' });
        }

        // Return the footer entry
        res.status(200).json({ success: true, data: footerEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to delete an existing footer entry by ID
export const deleteFooter = async (req, res) => {
    try {
        const { id } = req.params; // Footer entry ID
        
        // Find the footer entry by ID
        const footerEntry = await FooterModel.findById(id);
        if (!footerEntry) {
            return res.status(404).json({ success: false, message: 'Footer entry not found' });
        }

        // If the footer entry has a logo, delete it from Cloudinary
        if (footerEntry.public_id) {
            await cloudinary.uploader.destroy(footerEntry.public_id);
        }

        // Delete the footer entry from the database
        await FooterModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Footer entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
