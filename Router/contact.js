import express from "express";
import { createContact, getContacts } from "../Controllers/ContactController.js";

export const contactRouter = express.Router();


contactRouter.post('/', createContact)
contactRouter.get('/', getContacts)