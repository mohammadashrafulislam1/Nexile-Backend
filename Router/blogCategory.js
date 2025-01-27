import express from 'express';
import { addBlogCategory, deleteBlogCategory, getBlogCategories, updateBlogCategory } from '../Controllers/BlogCategoryController.js';

export const blogCategoryRouter = express.Router();
// add api
blogCategoryRouter.post('/', addBlogCategory)
// update api
blogCategoryRouter.put('/:id', updateBlogCategory)

// get all api
blogCategoryRouter.get('/', getBlogCategories)
// delete api
blogCategoryRouter.delete('/:id', deleteBlogCategory)