import express from "express";
import { upload } from "../Middleware/multer.js";
import { addTeamMember, deleteTeamMember, getAllTeamMembers, updateTeamMember } from "../Controllers/TeamController.js";

export const teamRouter = express.Router();

// Route to add a team member (with image upload)
teamRouter.post('/', upload.single('image'), addTeamMember);

// Route to update a team member by ID (with image upload)
teamRouter.put('/:id', upload.single('image'), updateTeamMember);

// Route to get all team members
teamRouter.get('/', getAllTeamMembers);

// Route to delete a team member by ID
teamRouter.delete('/:id', deleteTeamMember);