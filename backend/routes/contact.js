const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Set up the NodeMailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST api/contact
// @desc    Submit a contact form & Send Email
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, projectType, message } = req.body;

  try {
    // 1. Save data into your MongoDB database
    const newContact = new Contact({
      name,
      email,
      projectType,
      message
    });
    const contact = await newContact.save();

    // 2. Draft the email that will be sent to YOU
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending it to your own inbox
      subject: `🚨 New Reel Forge Lead: ${name} (${projectType})`,
      text: `
      You have a new contact request from the Reel Forge website!
      
      Client Details:
      Name: ${name}
      Email: ${email}
      Project Type: ${projectType}
      
      Message:
      ${message}
      `
    };

    // 3. Send the lead notification email to YOU (Admin)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending admin email notification:', error);
      } else {
        console.log('Admin notification sent!');
      }
    });

    // 4. Send an auto-reply confirmation email to the CLIENT
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Targeting the email address they typed in the form
      subject: `Thank you for contacting Reel Forge, ${name}!`,
      text: `Hi ${name},
      
Thank you for reaching out to Reel Forge! We have successfully received your inquiry regarding your ${projectType} project.

We will review your details and get back to you as soon as possible to discuss strategy and production.

For your records, here is a copy of your message:
"${message}"

Best regards,
The Reel Forge Team
`
    };

    // Dispatch the auto-reply
    transporter.sendMail(clientMailOptions, (error, info) => {
      if (error) console.error('Error sending client auto-reply:', error);
    });

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/contact
// @desc    Get all contact messages (Admin)
// @access  Public (Should be protected in production)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
