const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  linkedinURL: String,
  githubURL: String,
  currentCTC: { type: String, required: true },
  expectedCTC: { type: String, required: true },
  experience: { type: String, required: true },
  previousOrganization: String,
  role: { type: String, required: true },
  previousProjectTitle: String,
  projectDescription: String,
  resumeURL: { type: String, required: true },
  salarySlipURL: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Application1', applicationSchema);
