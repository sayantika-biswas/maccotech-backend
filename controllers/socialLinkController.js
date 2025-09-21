const SocialLink = require('../models/SocialLink');

// Get all social links
exports.getAll = async (req, res) => {
  try {
    const links = await SocialLink.find().sort({ createdAt: -1 });
    res.json({
      count: links.length,
      data: links
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single social link by ID
exports.getById = async (req, res) => {
  try {
    const link = await SocialLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: 'Social link not found' });
    }
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create single or multiple social links
exports.create = async (req, res) => {
  try {
    const links = Array.isArray(req.body) ? req.body : [req.body];
    
    // Validate all links
    const validLinks = links.map(link => {
      if (!link.platform || !link.url) {
        throw new Error('Each link must have platform and url');
      }
      return {
        platform: link.platform.toLowerCase(),
        url: link.url
      };
    });

    const createdLinks = await SocialLink.insertMany(validLinks);
    
    res.status(201).json({
      message: `Successfully created ${createdLinks.length} link(s)`,
      data: createdLinks
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a social link
exports.update = async (req, res) => {
  try {
    const link = await SocialLink.findById(req.params.id);
    if (!link) {
      return res.status(404).json({ message: 'Social link not found' });
    }

    if (req.body.platform) link.platform = req.body.platform.toLowerCase();
    if (req.body.url) link.url = req.body.url;

    const updatedLink = await link.save();
    res.json({
      message: 'Social link updated successfully',
      data: updatedLink
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a social link
exports.delete = async (req, res) => {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) {
      return res.status(404).json({ message: 'Social link not found' });
    }
    res.json({ message: 'Social link deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple social links by IDs
exports.deleteMultiple = async (req, res) => {
  try {
    if (!req.body.ids || !Array.isArray(req.body.ids)) {
      return res.status(400).json({ message: 'Array of IDs is required' });
    }

    const result = await SocialLink.deleteMany({ 
      _id: { $in: req.body.ids } 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No links found to delete' });
    }

    res.json({ 
      message: `Deleted ${result.deletedCount} link(s) successfully` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};