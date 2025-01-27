import mongoose from "mongoose";

const howWeWorkSchema = new mongoose.Schema({
    video: { type: String, required: true },
    thumbnail: { type: String, required: true },
    publicId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    color:{ type: String, required: true },
});

export const HowWeWorkModel = mongoose.model('howWeWork', howWeWorkSchema);
