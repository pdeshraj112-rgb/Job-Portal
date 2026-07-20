const express = require('express');
const router = express.Router();
const {
  getStats, getAllUsers, toggleUserActive, deleteUser,
  getAllJobsAdmin, setJobStatus, createCategory, getCategories, deleteCategory,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);

router.get('/users', getAllUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id/status', setJobStatus);

router.route('/categories')
  .get(getCategories)
  .post(createCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
