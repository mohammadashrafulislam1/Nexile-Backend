import express from "express";
import { upload } from "../Middleware/multer.js";
import { addService, deleteService, getAllServices, getOneService, updateService } from "../Controllers/ServicesController.js";


export const serviceRouter = express.Router();

const maxImagesPerSection = 10; // Define a maximum limit for uploads

const uploadFields = [
  { name: 'mainServiceImage', maxCount: 1 },
];

// Dynamically generate upload fields for each section
const sections = ['approach', 'process', 'why', 'tools'];
sections.forEach(section => {
  for (let i = 0; i < maxImagesPerSection; i++) {
    uploadFields.push({ name: `${section}[${i}][image]`, maxCount: 1 });
  }
});



// Route to add a new service with image upload
serviceRouter.post("/", upload.fields(uploadFields), addService);

// Route to update an existing service
serviceRouter.put("/:id", upload.fields(uploadFields), updateService);

// Route to get all services
serviceRouter.get("/", getAllServices);

serviceRouter.get("/:title", getOneService);

// Route to delete a service
serviceRouter.delete("/:id", deleteService);

