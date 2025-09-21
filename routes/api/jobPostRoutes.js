// routes/jobPostRoutes.js
const express = require('express');
const jobPostController = require('../../controllers/jobPostController');
const authController = require('../../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
// router.use(authController.protect);

// Restrict to admin users
// router.use(authController.restrictTo('admin', 'hr'));

// Job Post Routes
router.get('/', jobPostController.getAllJobPosts)
  
router.post('/', jobPostController.saveDraft);

router.post('/publish', jobPostController.publishJob);

router.get('/:id', jobPostController.getJobPost)
router.post('/:id', jobPostController.saveDraft)
router.delete('/:id', jobPostController.deleteJobPost)

router.post('/:id/publish', jobPostController.publishJob)

module.exports = router;