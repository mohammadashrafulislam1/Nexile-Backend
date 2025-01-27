import { TechCategoryModel } from "../Model/TechCategoryModel.js";

export const addTechCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const techCategory = new TechCategoryModel({ name });
    await techCategory.save();
    res.status(200).json({ message: "Tech Category added successfully!", techCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTechCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const techCategory = await TechCategoryModel.findById(id);

    if (!techCategory) {
      return res.status(404).json({ message: "Tech Category not found!" });
    }

    techCategory.name = name || techCategory.name;
    await techCategory.save();
    res.status(200).json({ message: "Tech Category updated successfully!", techCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTechCategories = async (req, res) => {
  try {
    const techCategories = await TechCategoryModel.find();
    res.status(200).json({ message: "Tech Categories retrieved successfully!", techCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTechCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const techCategory = await TechCategoryModel.findById(id);

    if (!techCategory) {
      return res.status(404).json({ message: "This tech category does not exist!" });
    }

    await TechCategoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Tech Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
