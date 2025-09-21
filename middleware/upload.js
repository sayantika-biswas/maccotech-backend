// upload.js
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

// Configure AWS SDK
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Store in .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Store in .env
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
});

// Configure multer to use S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
    acl: 'public-read', // Optional: Set file permissions
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
