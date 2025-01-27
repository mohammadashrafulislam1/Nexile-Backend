import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { TeamModel } from '../Model/TeamModel.js';

// Add Team Member
export const addTeamMember = async (req, res) => {
    try {
        const { name, detail, des, role } = req.body;
        console.log(req.body, req.files, req.file)
        // Ensure all required fields are present
        if (!name || !detail || !des) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'nexile digital/team',
        });

        // Create a new team member entry
        const newTeamMember = new TeamModel({
            name,
            detail,
            role,
            des,
            image: result.secure_url, // Cloudinary URL
            publicId: result.public_id // Cloudinary public ID for later deletion
        });

        // Save the team member to the database
        await newTeamMember.save();

        // Remove the temporary file
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: "Team member added successfully!", teamMember: newTeamMember });
    } catch (error) {
        res.status(500).json({ message: "Failed to add team member", error: error.message });
    }
};

// Update Team Member
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, detail, des, role } = req.body;

        // Find the team member by ID
        const teamMember = await TeamModel.findById(id);
        if (!teamMember) {
            return res.status(404).json({ message: "Team member not found." });
        }
        console.log(req.body, req.file)

        // Prepare the updated data
    let updatedData = {
        name: name || teamMember.name,
        detail: detail || teamMember.detail,
        role: role || teamMember.role,
        des: des || teamMember.des
    };

        // If a new image is uploaded, handle Cloudinary upload
        if (req.file) {
            // Delete the old image from Cloudinary
            await cloudinary.uploader.destroy(teamMember.publicId);

            // Upload the new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'nexile digital/team',
            });

            updatedData.image = result.secure_url; // Update image URL
            updatedData.publicId = result.public_id; // Update public ID
            
        // Remove the temporary file
        fs.unlinkSync(req.file.path);
        }

        // Update the team member entry
        const updatedTeamMember = await TeamModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        res.status(200).json({ message: "Team member updated successfully!", teamMember: updatedTeamMember });
    } catch (error) {
        res.status(500).json({ message: "Failed to update team member", error: error.message });
    }
};


// Get all Team Members
export const getAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamModel.find();
        res.status(200).json(teamMembers);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Error fetching team members' });
    }
};

// Delete Team Member
export const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the team member by ID
        const teamMember = await TeamModel.findById(id);
        if (!teamMember) {
            return res.status(404).json({ message: "Team member not found." });
        }

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(teamMember.publicId);

        // Delete the team member from the database
        await TeamModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Team member deleted successfully." });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ message: "Failed to delete team member", error: error.message });
    }
};