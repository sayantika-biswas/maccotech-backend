// const Blog = require('../models/blog/blogModel');

// exports.createBlog = async (req, res) => {
//   try {
//     const {
//       blogTitle,
//       heading,
//       blogDescription,
//       category,
//       blogContent,
//       authorName,
//       readTime,
//       tags
//     } = req.body;

//     if (!req.file || !req.file.location) {
//       return res.status(400).json({ message: 'Featured image is required.' });
//     }

//     const blog = new Blog({
//       blogTitle,
//       heading,
//       blogDescription,
//       category,
//       blogContent,
//       authorName,
//       readTime,
//       tags: tags?.split(',').map(tag => tag.trim()),
//       featuredImage: req.file.location
//     });

//     const savedBlog = await blog.save();
//     res.status(201).json(savedBlog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to create blog' });
//   }
// };
// exports.getAllBlogs = async (req, res) => {
//     try {
//       const blogs = await Blog.find().sort({ createdAt: -1 });
//       res.status(200).json(blogs);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to fetch blogs' });
//     }
//   };
//   exports.getBlogById = async (req, res) => {
//     try {
//       const blog = await Blog.findById(req.params.id);
//       if (!blog) {
//         return res.status(404).json({ message: 'Blog not found' });
//       }
//       res.status(200).json(blog);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to fetch blog' });
//     }
//   };
//   exports.updateBlog = async (req, res) => {
//     try {
//       const {
//         blogTitle,
//         heading,
//         blogDescription,
//         category,
//         blogContent,
//         authorName,
//         readTime,
//         tags
//       } = req.body;
  
//       const updateData = {
//         blogTitle,
//         heading,
//         blogDescription,
//         category,
//         blogContent,
//         authorName,
//         readTime,
//         tags: tags?.split(',').map(tag => tag.trim()),
//       };
  
//       // If new image uploaded
//       if (req.file && req.file.location) {
//         updateData.featuredImage = req.file.location;
//       }
  
//       const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
//       if (!updatedBlog) {
//         return res.status(404).json({ message: 'Blog not found' });
//       }
  
//       res.status(200).json(updatedBlog);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to update blog' });
//     }
//   };
//   exports.deleteBlog = async (req, res) => {
//     try {
//       const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
//       if (!deletedBlog) {
//         return res.status(404).json({ message: 'Blog not found' });
//       }
//       res.status(200).json({ message: 'Blog deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Failed to delete blog' });
//     }
//   };
const mongoose = require('mongoose');
const Blog = require('../models/blog/blogModel');

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const {
      blogTitle,
      heading,
      blogDescription,
      category,
      blogContent,
      authorName,
      readTime,
      tags
    } = req.body;

    if (!req.file || !req.file.location) {
      return res.status(400).json({ message: 'Featured image is required.' });
    }

    const blog = new Blog({
      blogTitle,
      heading,
      blogDescription,
      category,
      blogContent,
      authorName,
      readTime,
      tags: tags?.split(',').map(tag => tag.trim()),
      featuredImage: req.file.location
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Get Blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  try {
    const {
      blogTitle,
      heading,
      blogDescription,
      category,
      blogContent,
      authorName,
      readTime,
      tags
    } = req.body;

    const updateData = {
      blogTitle,
      heading,
      blogDescription,
      category,
      blogContent,
      authorName,
      readTime,
      tags: tags?.split(',').map(tag => tag.trim()),
    };

    if (req.file && req.file.location) {
      updateData.featuredImage = req.file.location;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
