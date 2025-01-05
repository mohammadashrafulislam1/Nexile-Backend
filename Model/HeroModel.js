import mongoose from "mongoose";

// Define the schema for each menu item
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the menu item
    link: { type: String, required: true }, // Link for the menu item
});

const heroSchema = new mongoose.Schema({
    logo: { type: String},
    imagePublicId: { type: String},
    menu:  [menuItemSchema],
    title: { type: String},
    description: { type: String},
    googleReview: { type: String},
    nexileReview: { type: String},
    clients: { type: String},
    experience: { type: String}
});

export const HeroModel = mongoose.model('hero', heroSchema);
