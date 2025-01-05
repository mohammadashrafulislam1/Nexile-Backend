import mongoose from "mongoose";

const founderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    des: { type: String, required: true },
    year: { type: String, required: true },
    satisfaction: { type: String, required: true },
    completedPersonally:{ type: String, required: true },
    website:{ type: String, required: true },
    experience:{ type: String, required: true },
    founderName:{ type: String, required: true },
    founderImage:{ type: String, required: true },
    publicId: { type: String, required: true },
});

export const FounderModel = mongoose.model('founder', founderSchema);
