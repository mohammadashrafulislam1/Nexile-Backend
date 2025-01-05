import mongoose from "mongoose";

// Schema for sections like Approach, Process, Why, Tools, and Portfolio
const sectionSchema = new mongoose.Schema({
  title: { type: String},
  description: { type: String}, 
  image: { type: String, required: false },
  imagePublicId: { type: String},
});

// Sub-service schema for individual services within a main service
const servicesSchema = new mongoose.Schema({
  title: { type: String}, 
  mainServiceImage: { type: String},
  mainServiceImagePublicId: { type: String},
  subtitle: { type: String},
  approach: { type: [sectionSchema]},
  process: { type: [sectionSchema]}, 
  why: { type: [sectionSchema]},
  tools: [{type: mongoose.Schema.Types.ObjectId, ref: 'techStack' }], 
}, { timestamps: true });

export const ServicesModel = mongoose.model('Service', servicesSchema);
