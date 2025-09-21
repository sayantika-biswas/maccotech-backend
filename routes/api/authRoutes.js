const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const upload = require('../../middleware/upload');

router.post('/', upload.single('profilePicture'), authController.register);
router.post('/login', authController.login);

module.exports = router;
