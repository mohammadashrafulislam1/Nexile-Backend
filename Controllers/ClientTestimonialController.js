import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { ClientTestimonialModel } from '../Model/ClientTestimonialModel.js';

// Helper function for uploading images
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'nexile digital/clientTestimonial'
        });
        fs.unlinkSync(filePath); // Delete temp file
        return { url: result.secure_url, public_id: result.public_id };
    } catch (error) {
        throw new Error('Error uploading image');
    }
};

// Add a new client testimonial
export const addClientTestimonial = async (req, res) => {
    try {
        const { testimonialText, clientName, clientDescription, rating, websiteOrVideoLink } = req.body;
        console.log(req.body, req.file)

        // Parse socialLinks if needed
        const socialLinks = typeof req.body.socialLinks === 'string' 
            ? JSON.parse(req.body.socialLinks) 
            : req.body.socialLinks;

        let clientImageData = null;
        if (req.file) {
            clientImageData = await uploadImage(req.file.path);
        }

        const newTestimonial = new ClientTestimonialModel({
            testimonialText,
            clientName,
            clientImage: clientImageData?.url,
            publicId: clientImageData?.public_id,
            clientDescription,
            rating,
            socialLinks,
            websiteOrVideoLink
        });

        await newTestimonial.save();
        console.log(newTestimonial)
        res.status(201).json({ success: true, message: 'Client testimonial added successfully', newTestimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a client testimonial
export const updateClientTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { testimonialText, clientName, clientDescription, rating, websiteOrVideoLink } = req.body;

        // Parse socialLinks if needed
        const socialLinks = typeof req.body.socialLinks === 'string' 
            ? JSON.parse(req.body.socialLinks) 
            : req.body.socialLinks;

        const testimonial = await ClientTestimonialModel.findById(id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        let clientImageData = testimonial.clientImage && { url: testimonial.clientImage, public_id: testimonial.publicId };

        // If a new file is uploaded, replace the image on Cloudinary
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (testimonial.publicId) {
                await cloudinary.uploader.destroy(testimonial.publicId);
            }
            // Upload the new image
            clientImageData = await uploadImage(req.file.path);
        }

        // Update the testimonial document
        testimonial.testimonialText = testimonialText || testimonial.testimonialText;
        testimonial.clientName = clientName || testimonial.clientName;
        testimonial.clientImage = clientImageData?.url || testimonial.clientImage;
        testimonial.publicId = clientImageData?.public_id || testimonial.publicId;
        testimonial.clientDescription = clientDescription || testimonial.clientDescription;
        testimonial.rating = rating || testimonial.rating;
        testimonial.socialLinks = socialLinks || testimonial.socialLinks;
        testimonial.websiteOrVideoLink = websiteOrVideoLink || testimonial.websiteOrVideoLink;

        await testimonial.save();
        res.status(200).json({ success: true, message: 'Client testimonial updated successfully', testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all client testimonials
export const getAllClientTestimonials = async (req, res) => {
    try {
        const testimonials = await ClientTestimonialModel.find();
        res.status(200).json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single client testimonial by ID
export const getClientTestimonialById = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await ClientTestimonialModel.findById(id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found.' });
        }
        res.status(200).json({ success: true, testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a client testimonial by ID
export const deleteClientTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the testimonial by ID
        const testimonial = await ClientTestimonialModel.findById(id);
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found.' });
        }

        // If 'testimonials' is expected to be an array
        if (Array.isArray(testimonial.testimonials)) {
            for (const t of testimonial.testimonials) {
                if (t.publicId) {
                    await cloudinary.uploader.destroy(t.publicId);
                }
            }
        } else {
            console.warn(`'testimonials' is not an array for ID: ${id}`);
        }

        // Remove the testimonial entry from the database
        await ClientTestimonialModel.findByIdAndDelete(id);

        // Remove related work entry, if applicable
        const work = await ClientTestimonialModel.findById(id);
        if (work) {
            await ClientTestimonialModel.findByIdAndDelete(id);
        }

        res.status(200).json({ success: true, message: 'Client testimonial deleted successfully.' });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
