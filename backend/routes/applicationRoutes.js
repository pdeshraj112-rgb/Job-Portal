const express = require('express');
const router = express.Router();
const {
  applyToJob, getMyApplications, getApplicantsForJob, updateApplicationStatus, withdrawApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const upload = require('../utils/fileUpload');

router.get('/mine', protect, authorize('seeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getApplicantsForJob);
router.post('/:jobId', protect, authorize('seeker'), upload.single('resume'), applyToJob);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('seeker'), withdrawApplication);

module.exports = router;
