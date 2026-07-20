const { asyncHandler } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Category = require('../models/Category');

// @desc    Dashboard summary stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalSeekers, totalEmployers, totalJobs, openJobs, totalApplications, totalCompanies] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seeker' }),
      User.countDocuments({ role: 'employer' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Application.countDocuments(),
      Company.countDocuments(),
    ]);

  res.json({ totalUsers, totalSeekers, totalEmployers, totalJobs, openJobs, totalApplications, totalCompanies });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  res.json(users);
});

// @desc    Activate / deactivate a user
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (admin)
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (String(user._id) === String(req.user._id)) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ _id: user._id, isActive: user.isActive });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// @desc    Get all jobs (admin moderation view)
// @route   GET /api/admin/jobs
// @access  Private (admin)
const getAllJobsAdmin = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('company', 'name').populate('postedBy', 'name email').sort('-createdAt');
  res.json(jobs);
});

// @desc    Admin: change job status (approve/close)
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (admin)
const setJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['open', 'closed', 'draft'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.json(job);
});

// @desc    Create a job category
// @route   POST /api/admin/categories
// @access  Private (admin)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }
  const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
  const exists = await Category.findOne({ slug });
  if (exists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  const category = await Category.create({ name, slug });
  res.status(201).json(category);
});

// @desc    List categories
// @route   GET /api/admin/categories  (also mounted publicly under /api/jobs/categories)
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name');
  res.json(categories);
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ message: 'Category deleted' });
});

module.exports = {
  getStats,
  getAllUsers,
  toggleUserActive,
  deleteUser,
  getAllJobsAdmin,
  setJobStatus,
  createCategory,
  getCategories,
  deleteCategory,
};
