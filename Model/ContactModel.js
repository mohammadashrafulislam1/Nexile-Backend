import mongoose from "mongoose";

// Define Mongoose Schema and Model
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String },
    web: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const ContactModel = mongoose.model('Contact', contactSchema);