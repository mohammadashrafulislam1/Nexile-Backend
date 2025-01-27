import express from 'express';
import { addTechCategory, deleteTechCategory, getTechCategories, updateTechCategory } from '../Controllers/TechCategory.js';

export const techCategoryRouter = express.Router();
// add api
techCategoryRouter.post('/', addTechCategory)
// update api
techCategoryRouter.put('/:id', updateTechCategory)

// get all api
techCategoryRouter.get('/', getTechCategories)
// delete api
techCategoryRouter.delete('/:id', deleteTechCategory)