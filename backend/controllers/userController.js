const { asyncHandler } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const updatable = [
    'name', 'phone', 'location', 'headline', 'bio', 'skills', 'experience', 'education', 'avatarUrl',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    phone: updated.phone,
    location: updated.location,
    headline: updated.headline,
    bio: updated.bio,
    skills: updated.skills,
    experience: updated.experience,
    education: updated.education,
    resumeUrl: updated.resumeUrl,
    avatarUrl: updated.avatarUrl,
  });
});

// @desc    Upload / attach a resume to the profile
// @route   POST /api/users/resume
// @access  Private (seeker)
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No resume file uploaded');
  }
  const user = await User.findById(req.user._id);
  user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
  await user.save();
  res.json({ resumeUrl: user.resumeUrl });
});

// @desc    Get public profile by id
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'name headline bio skills experience education avatarUrl location role'
  );
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc    Save / unsave a job
// @route   PUT /api/users/save-job/:jobId
// @access  Private (seeker)
const toggleSaveJob = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const jobId = req.params.jobId;
  const idx = user.savedJobs.findIndex((id) => String(id) === jobId);
  if (idx > -1) {
    user.savedJobs.splice(idx, 1);
  } else {
    user.savedJobs.push(jobId);
  }
  await user.save();
  res.json({ savedJobs: user.savedJobs });
});

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (seeker)
const getSavedJobs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedJobs',
    populate: { path: 'company', select: 'name logoUrl' },
  });
  res.json(user.savedJobs);
});

module.exports = { updateProfile, uploadResume, getUserById, toggleSaveJob, getSavedJobs };
