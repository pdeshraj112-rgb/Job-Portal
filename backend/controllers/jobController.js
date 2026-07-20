const { asyncHandler } = require('../middleware/authMiddleware');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get all jobs (search, filter, paginate)
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const {
    keyword,
    location,
    jobType,
    experienceLevel,
    category,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
    sort = '-createdAt',
  } = req.query;

  const query = { status: 'open' };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (location) query.location = { $regex: location, $options: 'i' };
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (category) query.category = category;
  if (minSalary) query.salaryMax = { $gte: Number(minSalary) };
  if (maxSalary) query.salaryMin = { ...(query.salaryMin || {}), $lte: Number(maxSalary) };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .populate('company', 'name logoUrl location')
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments(query),
  ]);

  res.json({
    jobs,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// @desc    Get single job by id
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('company', 'name logoUrl location website description')
    .populate('category', 'name')
    .populate('postedBy', 'name email');

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  job.views += 1;
  await job.save();

  res.json(job);
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (employer)
const createJob = asyncHandler(async (req, res) => {
  const {
    title, description, responsibilities, requirements, location, jobType,
    experienceLevel, salaryMin, salaryMax, currency, skills, vacancies,
    applicationDeadline, category, companyId,
  } = req.body;

  if (!title || !description || !location) {
    res.status(400);
    throw new Error('Title, description and location are required');
  }

  let company = await Company.findOne({ owner: req.user._id });
  if (companyId) {
    const explicit = await Company.findById(companyId);
    if (explicit && String(explicit.owner) === String(req.user._id)) company = explicit;
  }
  if (!company) {
    res.status(400);
    throw new Error('Please create your company profile before posting a job');
  }

  const job = await Job.create({
    title,
    description,
    responsibilities: responsibilities || [],
    requirements: requirements || [],
    location,
    jobType,
    experienceLevel,
    salaryMin,
    salaryMax,
    currency,
    skills: skills || [],
    vacancies,
    applicationDeadline,
    category: category || undefined,
    company: company._id,
    postedBy: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (employer who owns it, or admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  const updatable = [
    'title', 'description', 'responsibilities', 'requirements', 'location', 'jobType',
    'experienceLevel', 'salaryMin', 'salaryMax', 'currency', 'skills', 'vacancies',
    'applicationDeadline', 'category', 'status', 'isFeatured',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) job[field] = req.body[field];
  });

  const updated = await job.save();
  res.json(updated);
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (employer who owns it, or admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();

  res.json({ message: 'Job removed successfully' });
});

// @desc    Get jobs posted by logged in employer
// @route   GET /api/jobs/employer/mine
// @access  Private (employer)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate('company', 'name logoUrl')
    .sort('-createdAt');
  res.json(jobs);
});

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs };
