// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user')
const authMiddleware = require('../../middleware/authMiddleware')
const upload = require('../../middleware/upload');

router.get("/me", authMiddleware, userController.getUser );
router.put('/:id', authMiddleware, upload.single('profilePicture'), userController.updateUser);

module.exports = router;