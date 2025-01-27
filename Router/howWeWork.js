import express from "express";
import { upload } from "../Middleware/multer.js"; // Multer configuration
import { addHowWeWork, getHowWeWork, updateHowWeWork } from "../Controllers/HowWeWorkController.js";

export const howWeWorkRouter = express.Router();

// Route to add a new "How We Work" entry
howWeWorkRouter.post('/', upload.fields([{ name: 'thumbnail', maxCount: 1 }]), addHowWeWork);

// Route to update an existing "How We Work" entry by ID
howWeWorkRouter.put('/:id', upload.fields([{ name: 'thumbnail', maxCount: 1 }]), updateHowWeWork);

// get api:
howWeWorkRouter.get('/', getHowWeWork)
