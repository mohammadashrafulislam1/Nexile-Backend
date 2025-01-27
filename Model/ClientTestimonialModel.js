import mongoose from 'mongoose';

// Define the schema for social links
const socialLinkSchema = new mongoose.Schema({
  text: { type: String, required: true }, // e.g., "LinkedIn"
  link: { type: String, required: true }  // e.g., "https://linkedin.com/in/username"
});

// Define the schema for a single testimoniald
const clientTestimonialSchema = new mongoose.Schema({
  testimonialText: { type: String, required: true }, // The text of the testimonial
  clientName: { type: String, required: true }, // Name of the client
  clientImage: { type: String, required: true }, // URL of the client's image
  publicId: { type: String}, 
  clientDescription: { type: String }, // Additional description about the client
  rating: { type: Number, min: 1, max: 5 }, // Rating given by the client (1 to 5)
  socialLinks: [socialLinkSchema], // Array of social links
  websiteOrVideoLink: { type: String }, // URL to the client's website or a video link
  created_at: { type: Date, default: Date.now }
});


// Create the model
export const ClientTestimonialModel = mongoose.model('ClientTestimonial', clientTestimonialSchema);
