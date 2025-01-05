import nodemailer from 'nodemailer';
import { ContactModel } from '../Model/ContactModel.js';

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Controller for handling contact submissions
export const createContact = async (req, res) => {
    const { name, email, phone, service, web, subject, message } = req.body;

    try {
        // Create a new contact entry in the database
        const newContact = new ContactModel({
            name,
            email,
            phone,
            service,
            web,
            subject,
            message,
        });

        await newContact.save();

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: email, // Receiver address
            subject: 'Thank you for contacting Nexile Digital!',
            text: `Hello ${name},

Thank you for reaching out to us at Nexile Digital! 🎉 We’re thrilled to have received your message and are excited to assist you.

Here’s a quick summary of what you shared:  

**Subject**: "${subject || 'N/A'} " 

**Message**: 
"${message}"


Our team is already reviewing your request, and you can expect to hear back from us shortly. Whether it’s creating a stunning website, boosting your digital presence, or providing custom solutions, we’re here to help you achieve your goals.

Stay tuned—we’ll connect with you soon! 🚀

Warm regards,  
**The Nexile Digital Team**  
"Empowering businesses with innovative digital solutions!"  

---

### About the Nexile Digital

**Nexile Digital: All-In-One Digital Solutions, Right Here in One Place**  
At Nexile Digital, we are your ultimate partner for transforming your digital presence. From cutting-edge development to creative design and effective marketing strategies, our mission is to empower businesses like yours to thrive in the fast-paced digital world.

### Why Choose Us?

- ⭐ **Top-rated services**: 5-star reviews on Google and across platforms.
- 💼 **Successful clients**: Over 20+ happy partners and counting.
- 🌟 **9+ years of expertise**: Our Team is working in this field since 2016.
- 🚀 **Comprehensive services**: From development to SEO, video editing, and more.

**Our Mission**: To provide innovative and customized solutions that solve real-world challenges.  
**Our Vision**: To be the global leader in digital solutions, enabling every business to thrive online.

Ready to take the next step?  
📞 Contact us today or explore our services to see how we can make your vision a reality!

**Let’s Work Together**  
Discover how Nexile Digital can help your business grow:  
- 🌐 Visit us online: [Nexile Digital Website](#)  
- 📩 Email us: [Contact Us](#)  
- 📞 Call us: (Contact Number)
`,
        };

         // Email to you (your email address)
         const adminMailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: process.env.ADMIN_EMAIL, // Your email address
            subject: `Submission from Nexile Digital by: ${name}`,
            text: `You have received a new contact submission:

Name: ${name}  
Email: ${email}  
Phone: ${phone || 'N/A'}  
Service Interested In: ${service || 'N/A'}  
Website Url: ${web || 'N/A'}  
Subject: ${subject || 'N/A'}  
Message: 
${message || 'N/A'}

Please respond to the user promptly.
`,}
console.log('mailOptions:', mailOptions, process.env.ADMIN_EMAIL);
console.log('adminMailOptions:', adminMailOptions);

        // Send confirmation email
        await transporter.sendMail(mailOptions);

        // Send email notification to admin
        await transporter.sendMail(adminMailOptions);

        return res.status(201).json({ message: 'Contact saved and email sent successfully!' });
    } catch (error) {
        console.error('Error in createContact:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};


export const getContacts = async(req, res) =>{
    try{
      const contacts = await ContactModel.find();
      return res.status(201).json(contacts)
    }catch (error) {
        console.error('Error in createContact:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
}