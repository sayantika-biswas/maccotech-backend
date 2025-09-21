const express = require('express');
const router = express.Router();
const apiRoutes = require("./api/index.js");

router.use(express.json());

router.use("/api", apiRoutes);
router.get('/example', (req, res) => {
  res.send('Example route');
});
   
module.exports = router;
