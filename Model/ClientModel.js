import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    image: { type: String}, 
    publicId: { type: String}, 
    name: { type: String },
    description: { type: String },
    email: { type: String },
    phone: { type: String },
})
export const ClientModel = mongoose.model('Client', clientSchema);
