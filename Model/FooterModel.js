import mongoose from 'mongoose';


const socialMediaSchema = new mongoose.Schema({
    platform: { type: String }, // Social media platform name (e.g., "Instagram")
    url: { type: String }       // URL to the platform
});

const serviceSchema = new mongoose.Schema({
    name: { type: String }, // Service name (e.g., "Video Editing")
    link: { type: String }  // Optional URL to the service page
});

const resourceSchema = new mongoose.Schema({
    name: { type: String }, // Resource name (e.g., "Blog")
    link: { type: String }  // URL to the resource page
});

// Company schema with name and link fields for each section
const companySchema = new mongoose.Schema({
    name: { type: String }, // Resource name (e.g., "Blog")
    link: { type: String }  // URL to the resource page
});

const footerSchema = new mongoose.Schema({
    company: [companySchema],
    logo: { type:String },
    services: [serviceSchema],   // Array of services
    resources: [resourceSchema], // Array of resources
    followUs: [socialMediaSchema], // Array of social media platforms
    contactMessage: { type: String }, // e.g., "Let’s Work Together!"
    copyright: { 
        message: { type: String, default: 'All rights reserved' }, 
        company: { type: String, default: 'Nexile Digital' }
    }
});

export const FooterModel = mongoose.model('Footer', footerSchema);
