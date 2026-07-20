const { asyncHandler } = require('../middleware/authMiddleware');
const Company = require('../models/Company');
const User = require('../models/User');

// @desc    Create a company profile (employer)
// @route   POST /api/companies
// @access  Private (employer)
const createCompany = asyncHandler(async (req, res) => {
  const existing = await Company.findOne({ owner: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error('You already have a company profile');
  }

  const { name, logoUrl, website, industry, size, location, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Company name is required');
  }

  const company = await Company.create({
    name, logoUrl, website, industry, size, location, description, owner: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { company: company._id });

  res.status(201).json(company);
});

// @desc    Get logged-in employer's company
// @route   GET /api/companies/mine
// @access  Private (employer)
const getMyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  res.json(company);
});

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (owner or admin)
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  if (String(company.owner) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this company');
  }

  const updatable = ['name', 'logoUrl', 'website', 'industry', 'size', 'location', 'description'];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) company[field] = req.body[field];
  });

  const updated = await company.save();
  res.json(updated);
});

// @desc    Get a single company + its open jobs
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }
  res.json(company);
});

// @desc    List all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort('-createdAt');
  res.json(companies);
});

module.exports = { createCompany, getMyCompany, updateCompany, getCompanyById, getCompanies };
