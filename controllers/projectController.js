import Project from '../models/Project.js';
import asyncHandler from 'express-async-handler';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

// Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Configure multer for S3 upload
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `projects/${uniqueSuffix}-${file.originalname}`);
        },
    }),
});

const uploadImages = upload.array('images');
// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
    try {
        const { category, status, startDate, endDate, search } = req.query;

        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(filter).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    res.status(200).json({ success: true, data: project });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
    // First handle the file upload
    uploadImages(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ success: false, error: 'File upload failed' });
        }

        try {
            // Get uploaded image URLs
            const imageUrls = req.files?.map(file => file.location) || [];

            // Create project with all data
            const project = await Project.create({
                title: req.body.title,
                description: req.body.description,
                longDescription: req.body.longDescription,
                category: req.body.category,
                status: req.body.status,
                technologies: JSON.parse(req.body.technologies),
                liveUrl: req.body.liveUrl,
                githubUrl: req.body.githubUrl,
                featured: req.body.featured === 'true',
                images: imageUrls,
            });

            res.status(201).json({
                success: true,
                data: project
            });

        } catch (error) {
            console.error('Project creation error:', error);
            res.status(400).json({
                success: false,
                error: 'Project creation failed',
                message: error.message
            });
        }
    });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: project });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Optional: Delete associated images from S3
        // await deleteImagesFromS3(project.images);

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Delete multiple projects
// @route   DELETE /api/projects
// @access  Private/Admin
const deleteProjects = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400);
        throw new Error('Please provide an array of project IDs to delete');
    }

    const result = await Project.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('No projects found to delete');
    }

    res.status(200).json({
        success: true,
        message: `${result.deletedCount} project(s) deleted successfully`
    });
});

export {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    deleteProjects
};