import express from "express";
import { upload } from "../Middleware/multer.js";
import { addFooter, deleteFooter, getFooter, getFooterById, updateFooter } from "../Controllers/FooterController.js";

export const footerRouter = express.Router()

// Route to add a new footer entry
footerRouter.post("/", upload.single("logo"), addFooter);

// Route to update an existing footer entry by ID
footerRouter.put("/:id", upload.single("logo"), updateFooter);

// Route to get an existing footer entry by ID
footerRouter.get("/:id", getFooterById);

// get footer:
footerRouter.get('/', getFooter)

// Route to delete an existing footer entry by ID
footerRouter.delete("/:id", deleteFooter);