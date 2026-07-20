const { asyncHandler } = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/emailSender');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (seeker)
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (job.status !== 'open') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  const alreadyApplied = await Application.findOne({ job: job._id, applicant: req.user._id });
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied to this job');
  }

  const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : req.body.resumeUrl || req.user.resumeUrl;
  if (!resumeUrl) {
    res.status(400);
    throw new Error('A resume is required to apply. Upload one or add it to your profile');
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    resumeUrl,
    coverLetter: req.body.coverLetter || '',
  });

  job.applicationsCount += 1;
  await job.save();

  sendEmail({
    to: req.user.email,
    subject: `Application submitted: ${job.title}`,
    html: `<p>Your application for <b>${job.title}</b> has been received.</p>`,
  }).catch(() => {});

  res.status(201).json(application);
});

// @desc    Get applications for the logged-in seeker
// @route   GET /api/applications/mine
// @access  Private (seeker)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({
      path: 'job',
      select: 'title location jobType status company',
      populate: { path: 'company', select: 'name logoUrl' },
    })
    .sort('-createdAt');
  res.json(applications);
});

// @desc    Get all applicants for a specific job (employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (employer who owns job, or admin)
const getApplicantsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view applicants for this job');
  }

  const applications = await Application.find({ job: job._id })
    .populate('applicant', 'name email phone location skills resumeUrl avatarUrl')
    .sort('-createdAt');

  res.json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (employer who owns job, or admin)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const validStatuses = ['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const application = await Application.findById(req.params.id).populate('job').populate('applicant', 'name email');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (String(application.job.postedBy) !== String(req.user._id) && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = status;
  if (notes !== undefined) application.notes = notes;
  await application.save();

  sendEmail({
    to: application.applicant.email,
    subject: `Application update: ${application.job.title}`,
    html: `<p>Your application status for <b>${application.job.title}</b> is now: <b>${status}</b>.</p>`,
  }).catch(() => {});

  res.json(application);
});

// @desc    Withdraw / delete an application
// @route   DELETE /api/applications/:id
// @access  Private (seeker who owns it)
const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (String(application.applicant) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to withdraw this application');
  }

  await application.deleteOne();
  await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });

  res.json({ message: 'Application withdrawn' });
});

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  withdrawApplication,
};
