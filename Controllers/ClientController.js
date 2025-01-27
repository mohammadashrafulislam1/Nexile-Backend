import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { ClientModel } from '../Model/ClientModel.js';

// Helper function for uploading images to Cloudinary
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'nexile digital/clients'
        });
        fs.unlinkSync(filePath); // Delete the temp file after upload
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

// Controller to add a new client
export const addClient = async (req, res) => {
    try {
        const { name, description, email, phone } = req.body;
        let image = null;
        let publicId = null;

        // Check if image is uploaded
        if (req.file) {
            const uploadResult = await uploadImage(req.file.path);
            image = uploadResult.url;
            publicId = uploadResult.public_id;
        }

        // Create new client details
        const newClient = new ClientModel({
            image,
            publicId,
            name,
            description,
            email,
            phone,
        })


        // Save the new client section to the database
        await newClient.save();
        console.log(newClient)
        res.status(201).json({ success: true, data: newClient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params; // Client ID
        const { name, description, email, phone } = req.body; // Client details
        let updatedImage = null;
        let updatedPublicId = null;
       console.log(req.body)
        // Find the client by ID
        const client = await ClientModel.findById(id);
        if (!client) {
            console.log("Client not found");
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        // If a new image is uploaded, delete the old image from Cloudinary and upload the new one
        if (req.file) {
            // Delete the old image if it exists
            if (client.publicId) {
                await cloudinary.uploader.destroy(client.publicId);
            }

            // Upload the new image
            const uploadResult = await uploadImage(req.file.path);
            updatedImage = uploadResult.url;
            updatedPublicId = uploadResult.public_id;
        }

        // Update client fields with new or existing data
        client.name = name || client.name;
        client.description = description || client.description;
        client.email = email || client.email;
        client.phone = phone || client.phone;
        client.image = updatedImage || client.image;
        client.publicId = updatedPublicId || client.publicId;

        // Save the updated client
        await client.save(); // Corrected from newClient.save()

        console.log(client);
        
        res.status(200).json({ success: true, data: client });
    } catch (error) {
        console.error("Error updating client:", error); // Log the error for better debugging
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all Team Members
export const getAllClients = async (req, res) => {
    try {
        const clients = await ClientModel.find();
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ message: 'Error fetching team members' });
    }
};


// Controller to delete a client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params; // Client ID

        // Find the client by ID
        const clientSection = await ClientModel.findById(id);
        if (!clientSection) {
            return res.status(404).json({ success: false, message: 'Client section not found' });
        }

        // If the client has an image, delete it from Cloudinary
        if (clientSection.publicId) {
            await cloudinary.uploader.destroy(clientSection.publicId);
        }

        // Delete the client record
        await clientSection.deleteOne();

        res.status(200).json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

