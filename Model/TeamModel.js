import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String},
    detail: { type: String},
    role: { type: String},
    des: { type: String},
    image:{ type: String},
    publicId: { type: String},
});

export const TeamModel = mongoose.model('team', teamSchema);
