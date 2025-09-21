const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} = require('../../controllers/opening');

const upload = require('../../utils/s3Upload');

// Multipart fields for resume (required) and salary slip (optional)
router.post(
  '/create',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'salarySlip', maxCount: 1 }
  ]),
  createApplication
);

router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
