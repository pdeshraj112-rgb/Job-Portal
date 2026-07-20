const express = require('express');
const router = express.Router();
const {
  updateProfile, uploadResume, getUserById, toggleSaveJob, getSavedJobs,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

router.put('/profile', protect, updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.get('/saved-jobs', protect, getSavedJobs);
router.put('/save-job/:jobId', protect, toggleSaveJob);
router.get('/:id', getUserById);

module.exports = router;
