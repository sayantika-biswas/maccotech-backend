const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeeController');
const upload = require('../../utils/s3Upload');

router.post('/', upload.single('profilePicture'), employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployee);
router.put('/:id', upload.single('profilePicture'), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;