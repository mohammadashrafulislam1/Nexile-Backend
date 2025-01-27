import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import { heroRouter } from "./Router/hero.js";
import { serviceRouter } from "./Router/services.js";
import { aboutRouter } from "./Router/about.js";
import { howWeWorkRouter } from "./Router/howWeWork.js";
import { founderRouter } from "./Router/founder.js";
import { teamRouter } from "./Router/team.js";
import { workRouter } from "./Router/works.js";
import { clientTestimonialsRouter } from "./Router/clientTestimonial.js";
import { clientRouter } from "./Router/client.js";
import { faqRouter } from "./Router/faq.js";
import { blogsRouter } from "./Router/blogs.js";
import { footerRouter } from "./Router/footer.js";
import { techStackRouter } from "./Router/techStack.js";
import { techCategoryRouter } from "./Router/techCategory.js";
import { blogCategoryRouter } from "./Router/blogCategory.js";
import { contactRouter } from "./Router/contact.js";

// Load environment variables
configDotenv();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors())

// Middleware to parse JSON
app.use(express.json());

// ENDPOINT SETUP:
app.use('/api/hero', heroRouter)
app.use('/api/service', serviceRouter)
app.use('/api/about', aboutRouter)
app.use('/api/howwework', howWeWorkRouter)
app.use('/api/founder', founderRouter)
app.use('/api/team', teamRouter)
app.use('/api/works', workRouter)
app.use('/api/clientTestimonial', clientTestimonialsRouter)
app.use('/api/client', clientRouter)
app.use('/api/faq', faqRouter)
app.use('/api/blog', blogsRouter)
app.use('/api/footer', footerRouter)
app.use('/api/techStack', techStackRouter)
app.use('/api/techCategory', techCategoryRouter)
app.use('/api/blogCategory', blogCategoryRouter)
app.use('/api/contact', contactRouter)

// Check if the required environment variables are available
if (!process.env.MongoDB_User || !process.env.MongoDB_Pass) {
    console.error("MongoDB credentials not set in the environment variables");
    process.exit(1);
}

// MongoDB connection URI
const mongoURI = `mongodb+srv://${process.env.MongoDB_User}:${process.env.MongoDB_Pass}@cluster0.yfvuq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
