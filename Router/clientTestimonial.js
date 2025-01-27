import express from "express";
import { upload } from "../Middleware/multer.js";
import { addClientTestimonial, deleteClientTestimonial, getAllClientTestimonials, getClientTestimonialById, updateClientTestimonial } from "../Controllers/ClientTestimonialController.js";

export const clientTestimonialsRouter = express.Router();

// Route to add a new client testimonial
clientTestimonialsRouter.post("/", upload.single("clientImage"), addClientTestimonial);

// Route to update an existing client testimonial
clientTestimonialsRouter.put("/:id", upload.single("clientImage"), updateClientTestimonial);

// Route to get all client testimonials
clientTestimonialsRouter.get("/", getAllClientTestimonials);

// Route to get a specific client testimonial by ID
clientTestimonialsRouter.get("/:id", getClientTestimonialById);

// Route to delete a client testimonial
clientTestimonialsRouter.delete("/:id", deleteClientTestimonial);