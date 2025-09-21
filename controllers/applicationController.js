require("dotenv").config();
const nodemailer = require('nodemailer');
const Application = require('../models/carrer/Application');
const { uploadFile, deleteFile } = require('../config/aws');
const multer = require('multer');
const upload = multer();

// Helper for handling errors
const handleError = (res, error, status = 400) => {
  console.error(error);
  res.status(status).json({ success: false, error: error.message });
};

//Handling email send
const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST - Create new application
exports.createApplication = async (req, res) => {
  try {
    upload.single('resume')(req, res, async (err) => {
      if (err) return handleError(res, err);

      const { name, email, countryCode, phone, message } = req.body;
      let resumeUrl = '';

      if (req.file) {
        const result = await uploadFile(req.file);
        resumeUrl = result.Location;
      }

      //save to database
      const application = await Application.create({
        name,
        email,
        countryCode,
        phone,
        message,
        resumeUrl
      });

      //Send emails to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Application Form Submission',
        html: `
        <h2>Application Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong>${countryCode} ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Message:</strong> ${resumeUrl}</p>
        <p>Received at: ${new Date().toLocaleString()}</p>
      `
      };

      //Send emails to user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
        <h2>Thank you for your showing inters!</h2>
        <p>We have received your message and will get back to you soon.</p>
        <p>Here's what you submitted:</p>
        <p><strong>Your Resume:</strong> ${resumeUrl}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Submitted at: ${new Date().toLocaleString()}</p>
      `
      };

      // Send both emails in parallel
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions)
      ]);

      res.status(201).json({ success: true, data: application });
    });
  } catch (error) {
    handleError(res, error);
  }
};

// GET - Get all applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// GET - Get single application
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    handleError(res, error, 500);
  }
};

// PUT - Update application
exports.updateApplication = async (req, res) => {
  try {
    upload.single('resume')(req, res, async (err) => {
      if (err) return handleError(res, err);

      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, error: 'Application not found' });
      }

      const { name, email, countryCode, phone, message } = req.body;
      let resumeUrl = application.resumeUrl;

      // If new file uploaded
      if (req.file) {
        // Delete old file if exists
        if (application.resumeUrl) {
          const key = application.resumeUrl.split('/').pop();
          await deleteFile(`resumes/${key}`);
        }

        const result = await uploadFile(req.file);
        resumeUrl = result.Location;
      }

      const updated = await Application.findByIdAndUpdate(
        req.params.id,
        { name, email, countryCode, phone, message, resumeUrl },
        { new: true, runValidators: true }
      );

      res.json({ success: true, data: updated });
    });
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE - Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Delete file from S3 if exists
    if (application.resumeUrl) {
      const key = application.resumeUrl.split('/').pop();
      await deleteFile(`resumes/${key}`);
    }

    await application.remove();
    res.json({ success: true, data: {} });
  } catch (error) {
    handleError(res, error, 500);
  }
};