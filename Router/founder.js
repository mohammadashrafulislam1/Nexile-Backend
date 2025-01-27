import express from "express";
import { addFounder, getAllFounder, updateFounder } from "../Controllers/FounderController.js";
import { upload } from "../Middleware/multer.js";

export const founderRouter = express.Router();


// Route to add a founder (with image upload)
founderRouter.post('/', upload.single('founderImage'), addFounder);

// Route to update a founder by ID (with image upload)
founderRouter.put('/:id', upload.single('founderImage'), updateFounder);

// get founder
founderRouter.get('/', getAllFounder);