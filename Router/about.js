import express from "express";
import { upload } from "../Middleware/multer.js";
import { addAboutUs, getAboutUs, updateAboutUs } from "../Controllers/AboutController.js";

export const aboutRouter = express.Router();

// Route to add About Us
aboutRouter.post(
    "/",
    upload.fields([
        { name: "storyImage", maxCount: 1 },    
        { name: "missionImage", maxCount: 1 },   
        { name: "visionImage", maxCount: 1 } 
    ]),
    addAboutUs
);

// Route to update About Us
aboutRouter.put(
    "/:id",
    upload.fields([
        { name: "storyImage", maxCount: 1 },    
        { name: "missionImage", maxCount: 1 },   
        { name: "visionImage", maxCount: 1 } 
    ]),
    updateAboutUs
);

// get about:
aboutRouter.get('/', getAboutUs)

export default aboutRouter;
