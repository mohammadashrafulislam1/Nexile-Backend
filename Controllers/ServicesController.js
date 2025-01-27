import fs from 'fs';
import { cloudinary } from '../utils/cloudinary.js';
import { ServicesModel } from '../Model/ServicesModel.js';
import mongoose from 'mongoose';

export const addService = async (req, res) => {
  try {
    // Extract fields from the request body
    const { title, subtitle, approach, process, why, tools } = req.body;

    console.log("toolsArray:", tools);
    console.log("Received request body:", req.body);
    console.log("Received files:", req.files);
    // Parse tools into an array of ObjectIds    
    const toolsArray = tools ? tools.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [];


    // Initialize arrays for each section
    const approachItems = [];
    const processItems = [];
    const whyItems = [];

    // Function to handle uploads for each section
    const handleUploads = async (sectionItems, sectionName) => {
      if (Array.isArray(req.body[sectionName]) && req.files[`${sectionName}[image]`]) {
        const uploadPromises = req.files[`${sectionName}[image]`].map(async (file, index) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: `nexile digital/services/${sectionName}`, // Add folder structure
            });
            fs.unlinkSync(file.path); // Clean up local file storage
            return {
              title: req.body[sectionName][index]?.title || '',
              description: req.body[sectionName][index]?.description || '',
              image: result.secure_url,
              imagePublicId: result.public_id,
            };
          } catch (uploadError) {
            console.error(`Error uploading file for ${sectionName}:`, uploadError);
            return null; // Return null for failed uploads
          }
        });

        const uploadedItems = await Promise.all(uploadPromises);
        return uploadedItems.filter(item => item !== null); // Only include successful uploads
      }
      return []; // Return empty if no items
    };

    // Handle uploads for each section
    approachItems.push(...await handleUploads(approach, 'approach'));
    processItems.push(...await handleUploads(process, 'process'));
    whyItems.push(...await handleUploads(why, 'why'));

    // Handle the main service image upload
    let mainServiceImageUrl = '';
    let mainServiceImagePublicId = '';
    if (req.files['mainServiceImage']) {
      const mainImageFile = req.files['mainServiceImage'][0]; // Get the first file
      const mainImageUpload = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: `nexile digital/services`, // Add folder structure
      });
      mainServiceImageUrl = mainImageUpload.secure_url; 
      mainServiceImagePublicId = mainImageUpload.public_id;
      fs.unlinkSync(mainImageFile.path);
    }

    // Create a new service instance without wrapping services
    const newService = new ServicesModel({
      title,
      subtitle,
      mainServiceImage: mainServiceImageUrl,
      mainServiceImagePublicId: mainServiceImagePublicId,
      approach: approachItems,
      process: processItems,
      why: whyItems,
      tools: toolsArray || [],
    });

    console.log(newService);

    // Save the new service to the database
    await newService.save();

    res.status(201).json({ message: 'Service added successfully', service: newService });
  } catch (error) {
    console.error("Error in addService controller:", error);
    res.status(500).json({ message: 'Error adding service', error: error.message });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params; // Get the service ID from the request parameters
  try {
    // Extract fields from the request body
    const { title, subtitle, approach, process, why, tools } = req.body;
    
    const toolsArray = tools ? tools.split(',').map(id => new mongoose.Types.ObjectId(id.trim())) : [];



    console.log("toolsArray:", toolsArray);
    console.log("Received files:", JSON.stringify(req.files, null, 2));


    // Find the existing service by ID
    const service = await ServicesModel.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const handleUploads = async (existingItems = [], sectionName) => {
      const updatedItems = [...existingItems];
    
      if (Array.isArray(req.body[sectionName])) {
        for (let i = 0; i < req.body[sectionName].length; i++) {
          const newItem = req.body[sectionName][i];
          console.log(`Processing ${sectionName} item ${i}:`, newItem);
    
          const fileField = `${sectionName}[${i}][image]`;
    
          if (req.files[fileField] && req.files[fileField].length > 0) {
            const fileArray = req.files[fileField];
            for (const file of fileArray) {
              try {
                const result = await cloudinary.uploader.upload(file.path, {
                  folder: `nexile digital/services/${sectionName}`,
                });
                fs.unlinkSync(file.path); // Clean up local file storage
    
                updatedItems[i] = {
                  ...newItem,
                  image: result.secure_url,
                  imagePublicId: result.public_id,
                };
              } catch (uploadError) {
                console.error(`Error uploading file for ${sectionName}:`, uploadError);
              }
            }
          } else {
            updatedItems[i] = {
              ...updatedItems[i],
              title: newItem?.title || updatedItems[i].title,
              description: newItem?.description || updatedItems[i].description,
            };
          }
        }
      }
    
      return updatedItems;
    };
    
      

    // Handle updates for each section
    const updatedApproach = await handleUploads(service.approach, 'approach');
    const updatedProcess = await handleUploads(service.process, 'process');
    const updatedWhy = await handleUploads(service.why, 'why');

    // Handle the main service image upload if a new one is provided
    let mainServiceImageUrl = service.mainServiceImage; // Keep the existing image by default
    let mainServiceImagePublicId = service.mainServiceImagePublicId; // Keep the existing public ID by default
    if (req.files['mainServiceImage']) {
      const mainImageFile = req.files['mainServiceImage'][0]; // Get the first file
      const mainImageUpload = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: `nexile digital/services`, // Add folder structure
      });
      mainServiceImageUrl = mainImageUpload.secure_url;
      mainServiceImagePublicId = mainImageUpload.public_id;
      fs.unlinkSync(mainImageFile.path);
    }

    // Update the service fields
    service.title = title || service.title;
    service.subtitle = subtitle || service.subtitle;
    service.approach = updatedApproach;
    service.process = updatedProcess;
    service.why = updatedWhy;
    service.tools  = toolsArray || service.tools;
    service.mainServiceImage = mainServiceImageUrl;
    service.mainServiceImagePublicId = mainServiceImagePublicId;

    // Save the updated service to the database
    await service.save();

    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error("Error in updateService controller:", error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

  
// Get one service by ID
export const getOneService = async (req, res) => {
    const { title } = req.params;

    try {
        const findService = await ServicesModel.findOne({title: title});
        if (!findService) {
            return res.status(404).json({ message: 'Service not found' });
        } else {
            res.status(200).json(findService);
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Error fetching services' });
    }
};


// Get all services
export const getAllServices = async (req, res) => {
    try {
      const services = await ServicesModel.find();
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Error fetching services' });
    }
  };

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the service ID is passed in the URL

    // Find the service by ID
    const service = await ServicesModel.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Delete the main service image from Cloudinary
    if (service.mainServiceImagePublicId) {
      await cloudinary.uploader.destroy(service.mainServiceImagePublicId);
    }

    // Delete images from each section
    const sections = ['approach', 'process', 'why', 'tools'];
    for (const section of sections) {
      for (const item of service[section]) {
        if (item.imagePublicId) {
          await cloudinary.uploader.destroy(item.imagePublicId);
        }
      }
    }

    // Delete the service from the database
    await ServicesModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error("Error in deleteService controller:", error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};
  
