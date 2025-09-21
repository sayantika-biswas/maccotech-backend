// projectRoutes.js
const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjects
} = require('../../controllers/projectController');

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(createProject)
  .delete(deleteProjects);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;