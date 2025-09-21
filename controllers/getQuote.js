require("dotenv").config();
const nodemailer = require('nodemailer');
const Contact = require('../models/getQuote/getQuote');

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public

//Handling Sending Email
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


exports.createContact = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, message } = req.body;

        //Save to database
        const contact = await Contact.create({
            fullName,
            email,
            mobileNumber,
            message
        });

        //Send emails to admin
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Quotation Enquiry',
            html: `
        <h2>Quotation Enquiry Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${mobileNumber}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Received at: ${new Date().toLocaleString()}</p>
      `
        };

        //Send emails to user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting us',
            html: `
        <h2>Thank you for your submission!</h2>
        <p>We have received your message and will get back to you soon.</p>
        <p>Here's what you submitted:</p>
        <p><strong>Message:</strong> ${message}</p>
        <p>Submitted at: ${new Date().toLocaleString()}</p>
      `
        };

        // Send both emails in parallel
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        res.status(201).json({
            success: true,
            data: contact,
            message: 'Thank you for your message! We will contact you soon.'
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private/Admin
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private/Admin
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private/Admin
exports.updateContact = async (req, res) => {
    try {
        const { fullName, email, mobileNumber, message } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { fullName, email, mobileNumber, message },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact,
            message: 'Contact updated successfully'
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Contact deleted successfully'
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                error: 'Contact not found'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};