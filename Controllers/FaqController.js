import { FaqModel } from "../Model/FaqModel.js";


// Controller to add a new FAQ section with FAQs
export const addFaq = async (req, res) => {
  try {
      const { sectionTitle, sectionDescription, metaTitle, metaDescription, faqs } = req.body;
     console.log(req.body)
      // Create a new FAQ section with meta fields
      const newFaqSection = new FaqModel({
          sectionTitle,
          sectionDescription,
          metaTitle, // Meta title from request
          metaDescription, // Meta description from request
          faqs
      });

      await newFaqSection.save();
      res.status(201).json({ success: true, data: newFaqSection });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to update an existing FAQ section or individual FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { sectionTitle, sectionDescription, metaTitle, metaDescription, faqs } = req.body;

    console.log(req.body);

    const faqSection = await FaqModel.findById(id);
    if (!faqSection) {
      return res.status(404).json({ success: false, message: 'FAQ section not found' });
    }

    console.log(faqSection);

    // Update section and meta fields
    faqSection.sectionTitle = sectionTitle || faqSection.sectionTitle;
    faqSection.sectionDescription = sectionDescription || faqSection.sectionDescription;
    faqSection.metaTitle = metaTitle || faqSection.metaTitle;
    faqSection.metaDescription = metaDescription || faqSection.metaDescription;

    // Update the faqs if provided
    if (faqs) {
      faqSection.faqs = faqs;
    }

    await faqSection.save();
    res.status(200).json({ success: true, data: faqSection });
  } catch (error) {
    console.error('Error updating FAQ section:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all services
export const getAllFaq = async (req, res) => {
    try {
      const faqs = await FaqModel.find();
      res.status(200).json(faqs);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Error fetching services' });
    }
  };


// Delete hero with id
// Controller to delete an FAQ section or individual FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id, faqId } = req.params; // FAQ section ID and optional FAQ ID

    const faqSection = await FaqModel.findById(id);
    if (!faqSection) {
      return res.status(404).json({ message: 'FAQ section not found' });
    }

    if (faqId) {
      // Delete specific FAQ within the section
      const faqToRemove = faqSection.faqs.id(faqId);
      if (!faqToRemove) {
        return res.status(404).json({ message: 'FAQ not found in the section' });
      }

      // Remove the specific FAQ from the array
      faqSection.faqs.pull(faqId);
    } else {
      // Delete entire FAQ section
      await faqSection.deleteOne();
      return res.status(200).json({ message: 'FAQ section deleted successfully' });
    }

    await faqSection.save();
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Error deleting FAQ' });
  }
};

