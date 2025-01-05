import mongoose from "mongoose";

const worksSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'techCategory'}, // CategoryID of the showcase (e.g., Web Development, Video Editing)
  title: { type: String}, // Title of the project
  projectUrl: { type: String}, // URL for the live project or case study
  githubUrl: { type: String}, // URL for the live project or case study
  images: [{
    publicId: { type: String, required: true }, // Public ID for image (for use with Cloudinary or similar services)
    url: { type: String, required: true } // URL of the image
  }], // Array of image objects with publicId and URL
  client: { type: String}, // Name of the client
  shortDescription: { type: String}, // Short description of the project
  problemGoal: { type: String}, // Problem or goal faced by the client
  servicesProvided: [{ type: String}], // List of services provided
  projectTimeline: { type: String}, // Explanation of the project timeline
  customSolutions: { type: String}, // Description of tailored solutions
  metricsData: { 
    trafficIncrease: { type: String}, // Metrics on website traffic
    conversionRateImprovement: { type: String}, // Metrics on conversion rates
    pageSpeedImprovement: { type: String}, // Page speed metrics
    seoImprovements: { type: String}, // SEO improvement metrics
    videoEngagement: { type: String} // Video engagement metrics
  },
  clientTestimonial: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientTestimonial' }, // Reference to ClientTestimonial model
  techStack: [{type: mongoose.Schema.Types.ObjectId, ref: 'techStack' }], // TechnologiesId and tools used
   tags: [{ type: String }], // Array of tags/keywords for easier categorization and search
   isFeatured: { type: Boolean, default: false }, // Mark whether this showcase is featured
   completionDate: { type: Date }, // Date when the project was completed
   metaDescription: { type: String, required: false }, 
   metaTitle: { type: String, required: false }, 
   metaKeywords: [{ type: String }], // SEO meta keywords for the project
   completionDate: { type: Date} 
});

export const WorksModel = mongoose.model('Works', worksSchema);
