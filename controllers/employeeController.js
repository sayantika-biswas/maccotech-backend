const Employee = require('../models/employee/Employee');
const upload = require('../utils/s3Upload');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      profilePicture: req.file ? req.file.location : 'default.jpg'
    };

    const employee = await Employee.create(employeeData);
    res.status(201).json(employee);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort('-createdAt');

    // Add temporary signed URLs for images
    const employeesWithUrls = await Promise.all(
      employees.map(async emp => {
        if (!emp.profilePicture.includes('default.jpg')) {
          const url = await generateSignedUrl(emp.profilePicture);
          return { ...emp.toObject(), profilePictureUrl: url };
        }
        return emp.toObject();
      })
    );

    res.json(employeesWithUrls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Employee
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    let profilePictureUrl = null;
    if (!employee.profilePicture.includes('default.jpg')) {
      profilePictureUrl = await generateSignedUrl(employee.profilePicture);
    }

    res.json({ ...employee.toObject(), profilePictureUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.profilePicture = req.file.location;

      // Delete old image if exists
      const oldEmployee = await Employee.findById(req.params.id);
      if (oldEmployee.profilePicture && !oldEmployee.profilePicture.includes('default.jpg')) {
        await deleteFromS3(oldEmployee.profilePicture);
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Delete associated image
    if (employee.profilePicture && !employee.profilePicture.includes('default.jpg')) {
      await deleteFromS3(employee.profilePicture);
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to generate signed URL
const generateSignedUrl = async (s3Key) => {
  return await s3.getSignedUrlPromise('getObject', {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    Expires: 3600
  });
};

const deleteFromS3 = async (s3Key) => {
  await s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key
  }).promise();
};
