const express = require('express');
const router = express.Router();
const {
  getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs,
} = require('../controllers/jobController');
const { getCategories } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/categories', getCategories); // public list for filters/dropdowns
router.get('/employer/mine', protect, authorize('employer', 'admin'), getMyJobs);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('employer', 'admin'), createJob);

router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('employer', 'admin'), updateJob)
  .delete(protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;
