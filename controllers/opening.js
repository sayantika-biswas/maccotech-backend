const Application1 = require('../models/openingmodel');

// Create Application
exports.createApplication = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, linkedinURL, githubURL,
      currentCTC, expectedCTC, experience, previousOrganization,
      role, previousProjectTitle, projectDescription
    } = req.body;

    if (!req.files || !req.files.resume || !req.files.resume[0]) {
      return res.status(400).json({ message: 'Resume is required.' });
    }

    const resumeURL = req.files.resume[0].location;
    const salarySlipURL = req.files.salarySlip?.[0]?.location || null;

    const application = new Application1({
      firstName, lastName, email, phone, linkedinURL, githubURL,
      currentCTC, expectedCTC, experience, previousOrganization,
      role, previousProjectTitle, projectDescription,
      resumeURL, salarySlipURL
    });

    const savedApp = await application.save();
    res.status(201).json(savedApp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
};

// Get All Applications
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application1.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
};

// Get Application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application1.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch application.' });
  }
};

// Update Application
exports.updateApplication = async (req, res) => {
  try {
    const updated = await Application1.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Application not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update application.' });
  }
};

// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const deleted = await Application1.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Application not found.' });
    res.json({ message: 'Application deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete application.' });
  }
};
