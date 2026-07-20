const express = require('express');
const router = express.Router();
const {
  createCompany, getMyCompany, updateCompany, getCompanyById, getCompanies,
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.get('/mine', protect, authorize('employer', 'admin'), getMyCompany);

router.route('/')
  .get(getCompanies)
  .post(protect, authorize('employer', 'admin'), createCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(protect, authorize('employer', 'admin'), updateCompany);

module.exports = router;
