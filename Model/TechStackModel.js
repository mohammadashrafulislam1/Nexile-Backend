import mongoose from "mongoose";

const techStackSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},   
    publicId: { type: String, required: true },
})
export const TechStackModel = mongoose.model('techStack', techStackSchema);