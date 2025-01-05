import express from "express";
import { addFaq, deleteFaq, getAllFaq, updateFaq } from "../Controllers/FaqController.js";

export const faqRouter = express.Router();

// add faq:
faqRouter.post('/', addFaq)

// update faq:
faqRouter.put('/:id', updateFaq)

// get all faq:
faqRouter.get('/', getAllFaq)

// delete faq:
faqRouter.delete('/:id/:faqId', deleteFaq)