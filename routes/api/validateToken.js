const express = require('express');
const router = express.Router();
const validateToken = require('../../controllers/validateToken')

router.get('/', validateToken.getToken)

module.exports = router;