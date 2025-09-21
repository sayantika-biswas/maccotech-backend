const express = require('express');
const termsConModel = require('../../models/termsConModel');
const router = express.Router();

// CORS middleware
const setCorsHeaders = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
  next(); // Proceed to the next middleware or route handler
};

router.use(setCorsHeaders);

// POST /api/aboutus - Save content
router.post('/create', async (req, res) => {
  const { content } = req.body; // Get content from request body
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const newContent = new termsConModel({ content });
    await newContent.save(); // Save the content to the database
    return res.status(201).json({ message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
// PUT /api/aboutus - Update content
router.put('/update', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // Check if content already exists
    const existingContent = await termsConModel.findOne();
    if (existingContent) {
      // If content exists, update it
      existingContent.content = content;
      await existingContent.save();
      return res.status(200).json({ message: 'Content updated successfully' });
    } else {
      // If no content exists, create a new entry
      const newContent = new termsConModel({ content });
      await newContent.save();
      return res.status(201).json({ message: 'Content saved successfully' });
    }
  } catch (error) {
    console.error('Error updating content:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/aboutus - Fetch all saved content
router.get('/get', async (req, res) => {
  try {
    const content = await termsConModel.findOne().sort({ createdAt: -1 }); // Fetch the most recent content
    if (!content) {
      return res.status(404).json({ error: 'No content found' });
    }
    return res.json({ content: content.content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/aboutus/:id - Fetch content by ID
router.get('/:id', async (req, res) => {
  try {
    const content = await termsConModel.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    return res.json({ content: content.content });
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/aboutus/:id - Delete content by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const content = await termsConModel.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }
    return res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
