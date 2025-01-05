import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
})
export const BlogCategoryModel = mongoose.model('blogCategory', blogCategorySchema);