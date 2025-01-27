import { BlogCategoryModel } from "../Model/BlogCategoryModel.js";

export const addBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.body)
    const BlogCategory = new BlogCategoryModel({ name });
    await BlogCategory.save();
    res.status(200).json({ message: "Blog Category added successfully!", BlogCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const BlogCategory = await BlogCategoryModel.findById(id);

    if (!BlogCategory) {
      return res.status(404).json({ message: "Blog Category not found!" });
    }

    BlogCategory.name = name || BlogCategory.name;
    await BlogCategory.save();
    res.status(200).json({ message: "Blog Category updated successfully!", BlogCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogCategories = async (req, res) => {
  try {
    const BlogCategories = await BlogCategoryModel.find();
    res.status(200).json({ message: "Blog Categories retrieved successfully!", BlogCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const BlogCategory = await BlogCategoryModel.findById(id);

    if (!BlogCategory) {
      return res.status(404).json({ message: "This Blog category does not exist!" });
    }

    await BlogCategoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
