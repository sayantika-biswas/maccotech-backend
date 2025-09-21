const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogTitle: { type: String, required: true },
  heading: { type: String, required: true },
  blogDescription: { type: String, required: true },
  category: { type: String, required: true },
  blogContent: { type: String, required: true },
  authorName: { type: String, required: true },
  readTime: { type: String, required: true },
  tags: [String],
  featuredImage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
