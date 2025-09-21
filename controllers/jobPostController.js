// controllers/jobPostController.js
const AppError = require('../utils/appError');
const JobPost = require('../models/JobPost/index');
const catchAsync = require('../utils/catchAsync');

// Helper function to create/update job post
const handleJobPost = async (req, res, next, status) => {
  const {
    jobTitle,
    department,
    jobType,
    salaryMin,
    salaryMax,
    showSalary,
    jobDescription,
    requirements = [],
    applicationDeadline,
    hiringManager,
    applicationProcess,
    metaTitle,
    metaDescription,
    featuredJob
  } = req.body;

  // console.log('Received data:', req.body);

  const title = jobTitle || req.body.title;
  const description = jobDescription || req.body.description;

  const filteredRequirements = Array.isArray(requirements)
    ? requirements.filter(req => req && req.trim() !== '')
    : [];

  const jobPostData = {
    title,
    department,
    jobType,
    salaryRange: {
      min: salaryMin,
      max: salaryMax,
      showSalary: showSalary || false
    },
    description,
    requirements: filteredRequirements,
    applicationDetails: {
      deadline: applicationDeadline,
      hiringManager,
      process: applicationProcess || 'website'
    },
    seo: {
      metaTitle,
      metaDescription,
      featured: featuredJob || false
    },
    status,
    createdBy: req.user._id
  };

  if (status === 'published') {
    jobPostData.publishedAt = new Date();
  }

  let jobPost;
  if (req.params.id) {
    // Update existing job post
    jobPost = await JobPost.findByIdAndUpdate(
      req.params.id,
      jobPostData,
      { new: true, runValidators: true }
    );

    if (!jobPost) {
      return next(new AppError('No job post found with that ID', 404));
    }
  } else {
    // Create new job post
    jobPost = await JobPost.create(jobPostData);
  }

  res.status(status === 'published' ? 201 : 200).json({
    status: 'success',
    data: {
      jobPost
    }
  });
};

// Save as draft
exports.saveDraft = catchAsync(async (req, res, next) => {
  await handleJobPost(req, res, next, 'draft');
});

// Publish job
exports.publishJob = catchAsync(async (req, res, next) => {
  await handleJobPost(req, res, next, 'published');
});

// Get all job posts (for admin panel)
exports.getAllJobPosts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const jobPosts = await JobPost.find(filter).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: jobPosts.length,
      data: jobPosts
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job posts',
      error: err.message
    });
  }
};


// Get single job post
exports.getJobPost = catchAsync(async (req, res, next) => {
  const jobPost = await JobPost.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!jobPost) {
    return next(new AppError('No job post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      jobPost
    }
  });
});

// Delete job post
exports.deleteJobPost = catchAsync(async (req, res, next) => {
  const jobPost = await JobPost.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!jobPost) {
    return next(new AppError('No job post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});