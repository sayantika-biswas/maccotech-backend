const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../../controllers/blogController');

const upload = require('../../utils/s3Upload');

// Create Blog
router.post('/create', upload.single('featuredImage'), createBlog);

// Get All Blogs
router.get('/', getAllBlogs);

// Get Blog by ID
router.get('/:id', getBlogById);

// Update Blog (with optional image upload)
router.put('/:id', upload.single('featuredImage'), updateBlog);

// Delete Blog
router.delete('/:id', deleteBlog);

module.exports = router;
