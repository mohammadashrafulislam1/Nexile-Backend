import mongoose from "mongoose";

const faqDetailsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
    sectionTitle: { type: String, required: true },
    sectionDescription: { type: String, default: "" },
    metaTitle: { type: String, default: "" }, // New meta title
    metaDescription: { type: String, default: "" }, // New meta description
    faqs: [faqDetailsSchema]
});

export const FaqModel = mongoose.model('Faq', faqSchema);
