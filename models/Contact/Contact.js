const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  countryCode: {
    type: String,
    trime: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  interest: {
    type: String,
    required: [true, 'Interest is required'],
    enum: [
      'Website Development',
      'App Development',
      'Digital Marketing',
      'UI/UX Design',
      'Other'
    ]
  },
  company: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept terms and conditions'],
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'completed'],
    default: 'new'
  }
});

// Add text index for search functionality
contactSchema.index({
  name: 'text',
  email: 'text',
  company: 'text',
  message: 'text'
});

module.exports = mongoose.model('Contact', contactSchema);