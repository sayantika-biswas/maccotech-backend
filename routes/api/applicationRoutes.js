const express = require('express');
const router = express.Router();
const applicationController = require('../../controllers/applicationController');

// Public routes
router.post('/', applicationController.createApplication);

// Protected admin routes
router.get('/', applicationController.getApplications);
router.get('/:id', applicationController.getApplication);
router.put('/:id', applicationController.updateApplication);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;