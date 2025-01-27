import mongoose from "mongoose";

const techCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
})
export const TechCategoryModel = mongoose.model('techCategory', techCategorySchema);