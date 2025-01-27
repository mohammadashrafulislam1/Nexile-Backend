import express from "express";
import { addClient, deleteClient, getAllClients, updateClient } from "../Controllers/ClientController.js";
import { upload } from "../Middleware/multer.js";

export const clientRouter = express.Router();


// Route to add a new client
clientRouter.post('/', upload.single('image'), addClient);

// Route to update an existing client
clientRouter.put('/:id', upload.single('image'), updateClient);

// Get all clients:
clientRouter.get('/', getAllClients)

// Route to delete an existing client
clientRouter.delete('/:id', deleteClient);