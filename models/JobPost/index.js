// models/JobPost.js
const mongoose = require('mongoose');

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['wordpresdeveloper', 'secoexpert', 'businessanalyst', 'webdesigner', 'iosdeveloper', 'androidappdeveloper', 'hr']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['full-time', 'part-time', 'contract', 'internship', 'remote']
  },
  salaryRange: {
    min: Number,
    max: Number,
    showSalary: Boolean
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  requirements: [String],
  applicationDetails: {
    deadline: Date,
    hiringManager: String,
    process: {
      type: String,
      enum: ['email', 'website', 'linkedin', 'other']
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    featured: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date,
  updatedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobPostSchema.index({ status: 1 });
jobPostSchema.index({ department: 1 });
jobPostSchema.index({ jobType: 1 });
jobPostSchema.index({ createdAt: -1 });

const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;