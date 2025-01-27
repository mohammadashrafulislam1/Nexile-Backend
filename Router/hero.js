import express from "express";
import { upload } from "../Middleware/multer.js";
import { addHero, deleteHero, getHeros, updateHero } from "../Controllers/HeroController.js";

export const heroRouter = express.Router();

heroRouter.post('/', upload.single('logo'), addHero)
heroRouter.put('/:id', upload.single('logo'), updateHero)
heroRouter.delete('/:id', deleteHero)
heroRouter.get('/', getHeros)