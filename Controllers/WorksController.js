import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { WorksModel } from '../Model/WorksModel.js';

export const addWork = async (req, res) => {
  try {
    const {
      category,  // CategoryID now
      metaTitle,
      title,
      githubUrl,
      projectUrl,
      client,
      shortDescription,
      problemGoal,
      servicesProvided,
      projectTimeline,
      customSolutions,
      metricsData,
      tags,
      isFeatured,
      completionDate,
      metaDescription,
      metaKeywords,
      techStack,  // Now referencing by ID
      clientTestimonial, // Optional reference
    } = req.body;

    console.log("req.body", req.body);
    console.log("metricData:", metricsData);

    // Handle images upload
    let images = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'nexile digital/showcase_images'
        });
        images.push({ publicId: result.public_id, url: result.secure_url });
        fs.unlinkSync(file.path);
      }
    }

    // Parse metrics data if provided

    const newShowcase = new WorksModel({
      category,
      title,
      projectUrl,
      githubUrl,
      images,
      client,
      shortDescription,
      problemGoal,
      servicesProvided,
      projectTimeline,
      customSolutions,
      metricsData,
      clientTestimonial,
      techStack,  // Referencing by ID
      tags,
      isFeatured,
      completionDate,
      metaDescription,
      metaTitle,
      metaKeywords,
    });

    await newShowcase.save();
    console.log("New Work Created:", newShowcase);

    res.status(201).json({ success: true, message: 'Work added successfully', newShowcase });
  } catch (error) {
    console.error("Error adding work:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWork = async (req, res) => {
  const { id } = req.params;
  try {
    const existingWork = await WorksModel.findById(id);
    if (!existingWork) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }

    const {
      category,
      metaTitle,
      title,
      githubUrl,
      projectUrl,
      client,
      shortDescription,
      problemGoal,
      servicesProvided,
      projectTimeline,
      customSolutions,
      metricsData,
      tags,
      isFeatured,
      completionDate,
      metaDescription,
      metaKeywords,
      techStack, // Reference by ID
      clientTestimonial // Optional reference
    } = req.body;

    console.log("req.body", req.body);

    console.log("metricsUpdate", JSON.stringify(metricsData))

    // Update images if new ones are uploaded
    let images = existingWork.images.slice();
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'nexile digital/showcase_images',
        });
        images.push({ publicId: result.public_id, url: result.secure_url });
        fs.unlinkSync(file.path);
      }
    }



    // Update the techStack by IDs
    const techStackWithImages = techStack || existingWork.techStack;

    // Update the work with new data
    const updatedWork = await WorksModel.findByIdAndUpdate(
      id,
      {
        category: category || existingWork.category,
        title: title || existingWork.title,
        projectUrl: projectUrl || existingWork.projectUrl,
        githubUrl: githubUrl || existingWork.githubUrl,
        images,
        client: client || existingWork.client,
        shortDescription: shortDescription || existingWork.shortDescription,
        problemGoal: problemGoal || existingWork.problemGoal,
        servicesProvided: servicesProvided || existingWork.servicesProvided,
        projectTimeline: projectTimeline || existingWork.projectTimeline,
        customSolutions: customSolutions || existingWork.customSolutions,
        metricsData: metricsData || existingWork.metricsData,
        clientTestimonial: clientTestimonial || existingWork.clientTestimonial,
        techStack: techStackWithImages,
        tags: tags || existingWork.tags,
        isFeatured: isFeatured || existingWork.isFeatured,
        completionDate: completionDate || existingWork.completionDate,
        metaDescription: metaDescription || existingWork.metaDescription,
        metaTitle: metaTitle || existingWork.metaTitle,
        metaKeywords: metaKeywords || existingWork.metaKeywords,
      },
      { new: true }
    );

    console.log("Updated Work:", updatedWork);

    res.status(200).json({ success: true, message: 'Work updated successfully', updatedWork });
  } catch (error) {
    console.error("Error updating work:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Function to get all showcases
export const getAllShowcases = async (req, res) => {
    try {
      const works = await WorksModel.find()
      res.status(200).json({ success: true, works });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // Function to get a single showcase by ID
export const getShowcaseById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the work document by ID
      const work = await WorksModel.findById(id);
      if (!work) return res.status(404).json({ success: false, message: 'Work not found' });
  
  
      res.status(200).json({ success: true, work });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};
  
  // Function to get a showcase by title
  export const getShowcaseByTitle = async (req, res) => {
    try {
      const { title } = req.params; // Get the title from the request parameters
      
      // Replace dashes with spaces (if required)
      const formattedTitle = title.replace(/-/g, " "); // Replace dashes with spaces
  
      // Find the work document that contains the showcase with the specified title
      const work = await WorksModel.findOne({ title: formattedTitle });
  
      console.log(work);
  
      if (!work) {
        return res.status(404).json({ success: false, message: 'Work not found' });
      }
  
      res.status(200).json({ success: true, work });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Function to delete a showcase
export const deleteWork = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from request parameters

    // Find the work entry by ID
    const workToDelete = await WorksModel.findById(id);
    if (!workToDelete) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }

    // Delete images from Cloudinary
    if (workToDelete.images && workToDelete.images.length > 0) {
      for (const image of workToDelete.images) {
        await cloudinary.uploader.destroy(image.publicId); // Destroy the image by public ID
      }
    }

    // Delete tech stack images from Cloudinary
    if (workToDelete.techStack && workToDelete.techStack.length > 0) {
      for (const tech of workToDelete.techStack) {
        if (tech.publicId) {
          await cloudinary.uploader.destroy(tech.publicId); // Destroy tech stack image by public ID
        }
      }
    }

    // Remove the work entry from the database
    await WorksModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Work deleted successfully' });
  } catch (error) {
    console.error('Error deleting work:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTechStack = async (req, res) => {
  try {
    const { id, techId } = req.params; // Get work ID and tech ID from the request parameters
    const { publicId } = req.body; // Get the publicId from the request body

    // Find the work entry by ID
    const findWork = await WorksModel.findById(id);
    if (!findWork) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }

    // Find the tech stack entry to be deleted
    const techStackEntry = findWork.techStack.find(entry => entry._id.toString() === techId);
    if (!techStackEntry) {
      return res.status(404).json({ success: false, message: 'Tech stack entry not found' });
    }

    // Delete the image from Cloudinary if you want to remove it
   if(publicId){
    await cloudinary.v2.uploader.destroy(publicId); 
   }
    // Filter out the tech stack entry
    const updatedTechStack = findWork.techStack.filter(entry => entry._id.toString() !== techId);

    // Update the work entry with the new tech stack
    findWork.techStack = updatedTechStack;
    await findWork.save();

    res.status(200).json({ success: true, message: 'Tech stack entry deleted successfully', updatedTechStack });
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // Get the work ID from the request parameters
    const { publicId } = req.body; // Get the publicId from the request body

    // Check if both ID and publicId are provided
    if (!id || !publicId) {
      return res.status(400).json({ success: false, message: 'Work ID and publicId are required' });
    }

    // Find the work entry by ID
    const workEntry = await WorksModel.findById(id);
    if (!workEntry) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Optionally, remove the image reference from the database if it exists
    workEntry.images = workEntry.images.filter(image => image.publicId !== publicId);
    await workEntry.save(); // Save the updated work entry

    return res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
  
  